export default function AvatarMiyo() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      {/* Soft glow */}
      <div className="absolute inset-0 rounded-full bg-sakura/60 blur-xl opacity-60 animate-pulse" />
      {/* Sakura outline */}
      <div className="relative w-7 h-7 rounded-full bg-sakura-light border border-sakura/80 flex items-center justify-center">
        <span className="text-xs">🌸</span>
      </div>
    </div>
  );
}
