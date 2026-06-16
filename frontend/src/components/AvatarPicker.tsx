import {
  avatarBackgroundColors,
  avatarSeeds,
  getAvatarUrl,
} from '../lib/avatars'

type AvatarPickerProps = {
  selectedAvatar: string
  selectedBackgroundColor: string
  onSelectAvatar: (seed: string) => void
  onSelectBackgroundColor: (color: string) => void
}

function AvatarPicker({
  selectedAvatar,
  selectedBackgroundColor,
  onSelectAvatar,
  onSelectBackgroundColor,
}: AvatarPickerProps) {
  const currentAvatarIndex = avatarSeeds.indexOf(selectedAvatar)
  const avatarSrc = getAvatarUrl(selectedAvatar, selectedBackgroundColor)

  function handleNextAvatar() {
    const nextAvatarIndex = (currentAvatarIndex + 1) % avatarSeeds.length

    onSelectAvatar(avatarSeeds[nextAvatarIndex])
  }

  return (
    <div className="flex flex-col items-center gap-5 pt-1">
      <span className="px-1 text-sm font-bold tracking-wide text-[#c0c1ff] uppercase">
        Choose your Avatar
      </span>

      <button
        type="button"
        onClick={handleNextAvatar}
        className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#c0c1ff] bg-[#292932] shadow-[0_0_28px_rgba(192,193,255,0.38)] transition hover:scale-105 hover:border-white focus:ring-4 focus:ring-[#c0c1ff]/30 focus:outline-none active:scale-100"
        aria-label="Change avatar"
      >
        <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
      </button>

      <div className="grid grid-cols-6 gap-3">
        {avatarBackgroundColors.map((color) => {
          const isSelected = selectedBackgroundColor === color

          return (
            <button
              key={color}
              type="button"
              onClick={() => onSelectBackgroundColor(color)}
              className={`h-9 w-9 rounded-full border-2 transition hover:scale-110 focus:ring-4 focus:ring-[#c0c1ff]/25 focus:outline-none ${
                isSelected
                  ? 'border-white shadow-[0_0_18px_rgba(255,255,255,0.42)] outline-2 outline-offset-3 outline-[#c0c1ff]'
                  : 'border-[#555464]'
              }`}
              style={{ backgroundColor: `#${color}` }}
              aria-pressed={isSelected}
              aria-label={`Choose #${color} avatar background`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AvatarPicker
