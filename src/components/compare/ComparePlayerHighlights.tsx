import { motion } from 'framer-motion'
import type { ComparePlayerComputed } from '../../types/typesCompare'
import { formatInteger } from '../../helpers/compare'

type ComparePlayerHighlightsProps = {
  players: ComparePlayerComputed[]
}

export const ComparePlayerHighlights = ({ players }: ComparePlayerHighlightsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <motion.section
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {players.map((item) => (
        <motion.article
          key={item.series.id}
          className="rounded-2xl border border-white/10 bg-[#171717] p-4"
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 224, 148, 0.1)' }}
          transition={{ duration: 0.2 }}
        >
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/15 bg-[#1f1f1f]">
            {item.series.photoUrl ? (
              <img src={item.series.photoUrl} alt={item.series.name} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{item.series.name}</p>
            <p className="truncate text-sm text-white/65">{item.series.teamName}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="rounded-full bg-white/8 px-2 py-1">{item.series.nationality}</span>
          <span className="rounded-full bg-white/8 px-2 py-1">{item.series.position}</span>
          <span className="rounded-full bg-white/8 px-2 py-1">{item.series.age ? `${item.series.age} años` : 'Edad N/D'}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-xs text-white/50">Partidos</p>
            <p className="mt-1 font-bold text-white">{formatInteger(item.metrics.matchesPlayed)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-xs text-white/50">Goles</p>
            <p className="mt-1 font-bold text-white">{formatInteger(item.metrics.goals)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <p className="text-xs text-white/50">Asist.</p>
            <p className="mt-1 font-bold text-white">{formatInteger(item.metrics.assists)}</p>
          </div>
        </div>
        </motion.article>
      ))}
    </motion.section>
  )
}
