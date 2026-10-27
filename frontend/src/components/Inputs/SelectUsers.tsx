import React from 'react'
import { LuUsers } from 'react-icons/lu'
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import type { TeamMember } from '../../utils/types'
import Modal from '../Modal'
import AvatarGroup from '../AvatarGroup'

const SelectUsers = ({ selectedUsers, setSelectedUsers }: { selectedUsers: string[], setSelectedUsers: (users: string[]) => void }) => {
    const [allUsers, setAllUsers] = React.useState<TeamMember[]>([])
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [tempSelectedUsers, setTempSelectedUsers] = React.useState<string[]>([])

    const toggleUserSelection = (userId: string) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers)
        setIsModalOpen(false)
    }

    const openModal = () => {
        setTempSelectedUsers(selectedUsers)
        setIsModalOpen(true)
    }

    const selectedUserAvatars = allUsers.filter((user) => selectedUsers.includes(user._id))

    React.useEffect(() => {
        const controller = new AbortController()

        const getAllUsers = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, { signal: controller.signal })
                if (response.data?.length > 0) {
                    setAllUsers(response.data)
                }
            } catch (error) {
                if (controller.signal.aborted) return
                console.error('Error fetching users:', error)
            }
        }

        getAllUsers()

        return () => controller.abort()
    }, [])

    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatars.length === 0 && (
                <button type="button" className="card-btn" onClick={openModal}>
                    <LuUsers className="text-sm" /> Add Members
                </button>
            )}

            {selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={openModal}>
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users"
            >
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200"
                        >
                            <AvatarGroup avatars={[user]} maxVisible={1} />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-[13px] text-gray-500">{user.email}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
                            />
                        </div>
                    ))}

                    {allUsers.length === 0 && (
                        <p className="text-sm text-gray-500">No team members found.</p>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" className="card-btn" onClick={() => setIsModalOpen(false)}>
                        CANCEL
                    </button>
                    <button type="button" className="card-btn bg-primary! text-white!" onClick={handleAssign}>
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SelectUsers
