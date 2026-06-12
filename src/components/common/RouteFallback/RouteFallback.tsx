import './RouteFallback.css'

/** Fallback hiển thị trong lúc chunk của route lazy đang được tải. */
export function RouteFallback() {
  return <div className="route-fallback">Đang tải...</div>
}
