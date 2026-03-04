from sqlalchemy import text

from app.repositories.database import get_session
from app.schemas.value import (
    GrahamFilterRequest,
    GrahamFilterResponse,
    GrahamResultItem,
)


class ValueService:
    """Benjamin Graham value screening — queries pre-computed graham_metrics."""

    def run_filter(self, request: GrahamFilterRequest) -> GrahamFilterResponse:
        conditions = ["gm.date = :target_date"]
        params: dict = {"target_date": request.date}

        if request.eps_positive:
            conditions.append("gm.eps > 0")

        if request.pe_max is not None:
            conditions.append("gm.pe > 0 AND gm.pe <= :pe_max")
            params["pe_max"] = request.pe_max

        if request.pb_max is not None:
            conditions.append("gm.pb > 0 AND gm.pb <= :pb_max")
            params["pb_max"] = request.pb_max

        if request.pe_x_pb_max is not None:
            conditions.append("(gm.pe * gm.pb) <= :pe_x_pb_max")
            params["pe_x_pb_max"] = request.pe_x_pb_max

        if request.margin_of_safety_min is not None:
            conditions.append("gm.margin_of_safety >= :mos_min")
            params["mos_min"] = request.margin_of_safety_min

        where_clause = " AND ".join(conditions)

        allowed_sort = {"margin_of_safety", "pe", "pb", "graham_number", "eps", "bvps"}
        sort_col = request.sort_by if request.sort_by in allowed_sort else "margin_of_safety"
        sort_dir = "ASC" if request.sort_order == "asc" else "DESC"

        with get_session() as session:
            count_result = session.execute(
                text(f"""
                    SELECT COUNT(*) FROM graham_metrics gm
                    WHERE {where_clause}
                """),
                params,
            ).scalar()

            total = count_result or 0

            offset = (request.page - 1) * request.page_size
            params["limit"] = request.page_size
            params["offset"] = offset

            rows = session.execute(
                text(f"""
                    SELECT
                        gm.symbol,
                        s.gics_industry,
                        gm.date,
                        gm.close_price,
                        gm.eps,
                        gm.bvps,
                        gm.pe,
                        gm.pb,
                        gm.graham_number,
                        gm.margin_of_safety
                    FROM graham_metrics gm
                    LEFT JOIN stocks s ON gm.symbol = s.symbol
                    WHERE {where_clause}
                    ORDER BY gm.{sort_col} {sort_dir} NULLS LAST
                    LIMIT :limit OFFSET :offset
                """),
                params,
            ).mappings().all()

        items = [
            GrahamResultItem(
                symbol=row["symbol"],
                gics_industry=row["gics_industry"],
                date=str(row["date"]),
                close_price=round(float(row["close_price"]), 2),
                eps=round(float(row["eps"]), 4),
                bvps=round(float(row["bvps"]), 4),
                pe=round(float(row["pe"]), 2) if row["pe"] else None,
                pb=round(float(row["pb"]), 2) if row["pb"] else None,
                graham_number=round(float(row["graham_number"]), 2) if row["graham_number"] else None,
                margin_of_safety=round(float(row["margin_of_safety"]), 4) if row["margin_of_safety"] else None,
            )
            for row in rows
        ]

        return GrahamFilterResponse(
            items=items,
            total=total,
            page=request.page,
            page_size=request.page_size,
            filter_date=request.date,
        )
