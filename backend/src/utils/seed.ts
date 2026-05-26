import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { connectDB } from '../config/db.js'

dotenv.config()

const seedUsers = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Admin1234!',
        role: 'admin' as const,
        profileImageUrl: 'https://i.pravatar.cc/300?img=12',
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'User1234!',
        role: 'user' as const,
        profileImageUrl: 'https://i.pravatar.cc/300?img=33',
    },
]

const daysFromNow = (n: number): Date => {
    const d = new Date()
    d.setDate(d.getDate() + n)
    return d
}

const seed = async (): Promise<void> => {
    try {
        await connectDB()

        const { deletedCount: deletedTasks } = await Task.deleteMany({})
        const { deletedCount: deletedUsers } = await User.deleteMany({})
        console.log(`Wiped users (${deletedUsers}) and tasks (${deletedTasks})`)

        const idByEmail: Record<string, mongoose.Types.ObjectId> = {}
        for (const u of seedUsers) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(u.password, salt)

            const created = await User.create({
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
                profileImageUrl: u.profileImageUrl,
            })
            idByEmail[u.email] = created._id as mongoose.Types.ObjectId
            console.log(`Created ${u.role}: ${u.email}  (password: ${u.password})`)
        }

        const adminId = idByEmail['admin@example.com']!
        const userId = idByEmail['user@example.com']!

        const tasksToCreate = [
            // ----- Tâches de l'admin (créées et assignées à l'admin) -----
            {
                title: "Configurer l'environnement de production",
                description:
                    "Préparer les variables d'environnement et le déploiement sur le serveur de production.",
                priority: 'High' as const,
                status: 'In-Progress' as const,
                dueDate: daysFromNow(5),
                assignedTo: [adminId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Créer les variables .env de prod', completed: true },
                    { text: 'Configurer MongoDB Atlas', completed: true },
                    { text: 'Mettre en place le CI/CD', completed: false },
                    { text: 'Tester le déploiement', completed: false },
                ],
                progress: 50,
            },
            {
                title: 'Réviser les rôles et permissions',
                description:
                    'Auditer les rôles admin / user / member et vérifier la cohérence des middlewares.',
                priority: 'Medium' as const,
                status: 'Pending' as const,
                dueDate: daysFromNow(10),
                assignedTo: [adminId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Lister les routes protégées', completed: false },
                    { text: 'Vérifier le middleware adminOnly', completed: false },
                ],
                progress: 0,
            },
            {
                title: 'Préparer le rapport mensuel',
                description:
                    'Générer et envoyer le rapport Excel des tâches du mois aux parties prenantes.',
                priority: 'High' as const,
                status: 'Pending' as const,
                dueDate: daysFromNow(3),
                assignedTo: [adminId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Exporter les données via /report', completed: false },
                    { text: 'Vérifier les chiffres', completed: false },
                    { text: 'Envoyer par email', completed: false },
                ],
                progress: 0,
            },

            // ----- Tâches assignées à John Doe (créées par l'admin) -----
            {
                title: 'Implémenter la page de profil utilisateur',
                description:
                    "Créer la vue de profil avec édition du nom, de l'email et upload de la photo.",
                priority: 'Medium' as const,
                status: 'In-Progress' as const,
                dueDate: daysFromNow(7),
                assignedTo: [userId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Maquette validée', completed: true },
                    { text: 'Intégration du formulaire', completed: true },
                    { text: 'Appel API uploadImage', completed: false },
                    { text: 'Gestion des erreurs', completed: false },
                ],
                progress: 50,
            },
            {
                title: 'Corriger le bug de connexion',
                description:
                    "Le token JWT n'est pas renvoyé correctement après un login échoué puis réussi.",
                priority: 'High' as const,
                status: 'Pending' as const,
                dueDate: daysFromNow(2),
                assignedTo: [userId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Reproduire le bug en local', completed: false },
                    { text: 'Identifier la cause dans auth.controller', completed: false },
                    { text: 'Ajouter un test de régression', completed: false },
                ],
                progress: 0,
            },
            {
                title: "Rédiger la documentation de l'API",
                description:
                    'Documenter les endpoints /auth, /tasks et /users dans le README du backend.',
                priority: 'Low' as const,
                status: 'Pending' as const,
                dueDate: daysFromNow(14),
                assignedTo: [userId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Endpoints auth', completed: false },
                    { text: 'Endpoints tasks', completed: false },
                    { text: 'Endpoints users', completed: false },
                ],
                progress: 0,
            },
            {
                title: 'Écrire les tests unitaires des dashboards',
                description:
                    'Couvrir les composants UserDashboard et Admin Dashboard avec des tests.',
                priority: 'Medium' as const,
                status: 'Completed' as const,
                dueDate: daysFromNow(-2),
                assignedTo: [userId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Setup du runner de tests', completed: true },
                    { text: 'Tests UserDashboard', completed: true },
                    { text: 'Tests Admin Dashboard', completed: true },
                ],
                progress: 100,
            },

            // ----- Tâche partagée admin + user -----
            {
                title: "Revue de code de la feature 'tâches partagées'",
                description:
                    "Pair review entre l'admin et John Doe sur la fonctionnalité de multi-assignation.",
                priority: 'Medium' as const,
                status: 'In-Progress' as const,
                dueDate: daysFromNow(4),
                assignedTo: [adminId, userId],
                createdBy: adminId,
                attachments: [],
                todoChecklist: [
                    { text: 'Backend : endpoint multi-assign', completed: true },
                    { text: 'Frontend : sélecteur multi-utilisateurs', completed: false },
                    { text: 'QA croisée', completed: false },
                ],
                progress: 33,
            },
        ]

        await Task.insertMany(tasksToCreate)
        console.log(`Created ${tasksToCreate.length} tasks`)

        console.log('Seed done.')
    } catch (error) {
        console.error('Seed error:', error)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
    }
}

seed()
