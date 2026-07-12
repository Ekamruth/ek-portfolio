import { AnimatePresence, motion } from 'framer-motion'
import { usePortfolioMode } from './store/usePortfolioMode'
import { Welcome } from './components/Welcome'
import { ProfessionalApp } from './components/ProfessionalApp'
import { GamifiedApp } from './components/gamified/GamifiedApp'
import { ModeTransition } from './components/ModeTransition'

const ease = [0.22, 1, 0.36, 1]

function App() {
  const mode = usePortfolioMode((s) => s.mode)

  return (
    <>
    <ModeTransition />
    <AnimatePresence mode="wait">
      {mode === null && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease }}
        >
          <Welcome />
        </motion.div>
      )}
      {mode === 'professional' && (
        <motion.div
          key="professional"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <ProfessionalApp />
        </motion.div>
      )}
      {mode === 'gamified' && (
        <motion.div
          key="gamified"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <GamifiedApp />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

export default App
