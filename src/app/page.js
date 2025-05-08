'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
      <main className="min-h-screen bg-[#f5fbff] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl w-full flex flex-col-reverse lg:flex-row items-center justify-between py-12 sm:py-16 gap-8 sm:gap-12">

          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-xl text-center lg:text-left space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight">
              Bienvenue sur <span className="text-blue-600">Garderie Manager</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700">
              Gérez facilement la présence des enfants dans votre garderie.<br />
              Ajoutez, archivez, et suivez leur présence chaque semaine, de manière simple et rapide.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                    href="/dashboard"
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Accéder au tableau de bord
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md sm:max-w-lg"
          >
            <Image
                alt="Illustration garderie"
                width={600}
                height={400}
                className="w-full h-auto mx-auto"
                priority
                src="/home.png"
            />
          </motion.div>


        </div>
      </main>
  )
}
