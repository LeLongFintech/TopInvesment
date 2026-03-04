from supabase import Client, create_client

from app.config import get_settings

_client: Client | None = None


def get_supabase_client() -> Client:
    """Return a singleton Supabase client instance."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
