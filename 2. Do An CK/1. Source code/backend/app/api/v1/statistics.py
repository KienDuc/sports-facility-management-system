from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models.booking import Booking, BookingService, BookingSlot
from backend.app.models.court import Court
from backend.app.models.service import Service
from backend.app.api.v1.deps import get_current_active_admin, get_current_user
from backend.app.models.user import User


router = APIRouter(tags=["Statistics"])


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    today = date.today().isoformat()
    cancel_statuses = ["canceled", "cancelled"]

    total_courts = db.query(Court).count()
    active_courts = db.query(Court).filter(Court.is_active == True).count()
    total_bookings = db.query(Booking).count()

    today_bookings = (
        db.query(Booking)
        .filter(Booking.booking_date == today)
        .filter(Booking.status.notin_(cancel_statuses))
        .count()
    )

    today_revenue = (
        db.query(func.sum(Booking.total_price))
        .filter(Booking.booking_date == today)
        .filter(Booking.status.notin_(cancel_statuses))
        .scalar()
    )

    pending_bookings = (
        db.query(Booking)
        .filter(Booking.status.in_(["pending", "booked"]))
        .count()
    )

    playing_bookings = db.query(Booking).filter(
        Booking.status == "playing"
    ).count()

    cancelled_bookings = db.query(Booking).filter(
        Booking.status.in_(cancel_statuses)
    ).count()

    return {
        "total_courts": total_courts,
        "active_courts": active_courts,
        "total_bookings": total_bookings,
        "today_bookings": today_bookings,
        "today_revenue": float(today_revenue or 0),
        "pending_bookings": pending_bookings,
        "playing_bookings": playing_bookings,
        "cancelled_bookings": cancelled_bookings,
    }


@router.get("/revenue")
def get_revenue(
    days: int = Query(default=7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    cancel_statuses = ["canceled", "cancelled"]
    result = []

    for number in range(days - 1, -1, -1):
        current_date = date.today() - timedelta(days=number)
        date_text = current_date.isoformat()

        revenue = (
            db.query(func.sum(Booking.total_price))
            .filter(Booking.booking_date == date_text)
            .filter(Booking.status.notin_(cancel_statuses))
            .scalar()
        )

        result.append({
            "date": date_text,
            "revenue": float(revenue or 0),
        })

    return result


@router.get("/booking-status")
def get_booking_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    rows = (
        db.query(Booking.status, func.count(Booking.id))
        .group_by(Booking.status)
        .all()
    )

    result = []
    for status, count in rows:
        result.append({
            "status": status or "unknown",
            "count": count,
        })

    return result


@router.get("/top-courts")
def get_top_courts(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    cancel_statuses = ["canceled", "cancelled"]

    rows = (
        db.query(
            Court.id,
            Court.name,
            Court.type,
            func.count(BookingSlot.id),
            func.sum(BookingSlot.price),
        )
        .join(BookingSlot, BookingSlot.court_id == Court.id)
        .join(Booking, Booking.id == BookingSlot.booking_id)
        .filter(Booking.status.notin_(cancel_statuses))
        .group_by(Court.id, Court.name, Court.type)
        .order_by(func.count(BookingSlot.id).desc())
        .limit(limit)
        .all()
    )

    result = []
    for court_id, name, court_type, booking_count, revenue in rows:
        result.append({
            "court_id": court_id,
            "court_name": name,
            "court_type": court_type,
            "booking_count": booking_count,
            "revenue": float(revenue or 0),
        })

    return result


@router.get("/top-services")
def get_top_services(
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    cancel_statuses = ["canceled", "cancelled"]

    rows = (
        db.query(
            Service.id,
            Service.name,
            func.sum(BookingService.quantity),
            func.sum(BookingService.total_price),
        )
        .join(BookingService, BookingService.service_id == Service.id)
        .join(Booking, Booking.id == BookingService.booking_id)
        .filter(Booking.status.notin_(cancel_statuses))
        .group_by(Service.id, Service.name)
        .order_by(func.sum(BookingService.quantity).desc())
        .limit(limit)
        .all()
    )

    result = []
    for service_id, name, quantity, revenue in rows:
        result.append({
            "service_id": service_id,
            "service_name": name,
            "quantity": int(quantity or 0),
            "revenue": float(revenue or 0),
        })

    return result
