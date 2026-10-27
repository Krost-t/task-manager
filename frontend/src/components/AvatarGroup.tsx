import { getInitials } from '../utils/helper'

interface Avatar {
    name?: string
    profileImageUrl?: string | null
}

const AvatarGroup = ({ avatars, maxVisible = 3 }: { avatars: Avatar[], maxVisible?: number }) => {
  return (
    <div className="flex items-center">
        {avatars.slice(0, maxVisible).map((avatar, index) => (
            avatar.profileImageUrl ? (
                <img
                    key={index}
                    src={avatar.profileImageUrl}
                    alt={avatar.name || `Avatar ${index}`}
                    title={avatar.name}
                    className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
                />
            ) : (
                <div
                    key={index}
                    title={avatar.name}
                    className="w-9 h-9 flex items-center justify-center bg-blue-100 text-primary text-xs font-medium rounded-full border-2 border-white -ml-3 first:ml-0"
                >
                    {getInitials(avatar.name)}
                </div>
            )
        ))}

        {avatars.length > maxVisible && (
            <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
                +{avatars.length - maxVisible}
            </div>
        )}
    </div>
  )
}

export default AvatarGroup
