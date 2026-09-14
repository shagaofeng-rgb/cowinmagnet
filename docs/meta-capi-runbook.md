# Meta Pixel and Conversions API runbook

## Events implemented

| Site action | Browser Pixel | Server CAPI | Deduplication |
| --- | --- | --- | --- |
| Page navigation | `PageView` | No | Not applicable |
| Product detail opened | `ViewContent` | No | Not applicable |
| WhatsApp, email, or telephone intent | `Contact` | `Contact` | Shared `event_id` |
| Valid inquiry saved | `Lead` | `Lead` | Shared `event_id` |

The server never receives a Meta access token from a browser. `Lead` is sent only after the inquiry is valid and stored. A Meta delivery problem cannot reject or lose a valid website inquiry.

## One-time secure configuration

1. In Meta Events Manager, revoke the access token that was previously exposed outside the secret manager and generate a replacement with Conversions API access for the correct Pixel.
2. In Vercel **Production** environment variables, set `META_CAPI_ACCESS_TOKEN` to the replacement token. Do not paste it into source code, issues, chat, or `.env` files committed to Git.
3. Set `META_CAPI_PIXEL_ID` to the same value as `NEXT_PUBLIC_META_PIXEL_ID`; set `META_CAPI_ENABLED=true` and `META_CAPI_GRAPH_VERSION=v26.0`.
4. Redeploy production. Use `META_CAPI_TEST_EVENT_CODE` only for the Meta Test Events session, then remove it and redeploy so test traffic never reaches production reporting.

## Acceptance check

1. Open a product page and verify browser-side `PageView` and `ViewContent` in Meta Pixel Helper / Events Manager.
2. Trigger a WhatsApp, email, or phone contact click. In Test Events, one `Contact` should appear with Browser and Server sources, joined as a single event by `event_id`.
3. Submit one valid test inquiry. Confirm one `Lead` event with Browser and Server sources, also deduplicated by `event_id`.
4. Verify that the inquiry is still present in the website admin and that its email workflow succeeds even if Meta Test Events is unavailable.

## Operations and safety

- Rotate the CAPI token immediately if it is ever exposed. Change it only in Vercel, then redeploy.
- `META_CAPI_TEST_EVENT_CODE` is an operational testing switch, not a permanent production setting.
- CAPI retries transient network, timeout, and Meta 5xx/429 failures once with the same `event_id`; this preserves deduplication.
- Server logs contain only event name, status, and safe failure category. They never log a token, email, phone, click IDs, or payload.
