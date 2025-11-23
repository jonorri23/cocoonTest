import { Link } from 'wouter'
import { motion } from 'framer-motion'

export default function Home() {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#050505',
            color: '#e0e0e0',
            fontFamily: 'var(--font-main)'
        }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '4rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(45deg, #b084cc, #64ffda)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Cocoon
            </motion.h1>


            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '800px' }}>
                <Link href="/v1">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            width: '200px'
                        }}
                    >
                        <h2 style={{ marginBottom: '0.5rem' }}>Version 1</h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Scroll Experience</p>
                    </motion.div>
                </Link>

                <Link href="/v2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '2rem',
                            border: '1px solid rgba(100, 255, 218, 0.3)',
                            borderRadius: '16px',
                            background: 'rgba(100, 255, 218, 0.05)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            width: '200px'
                        }}
                    >
                        <h2 style={{ marginBottom: '0.5rem' }}>Version 2</h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Interactive 3D</p>
                    </motion.div>
                </Link>

                <Link href="/v4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '2rem',
                            border: '1px solid rgba(255, 235, 59, 0.3)',
                            borderRadius: '16px',
                            background: 'rgba(255, 235, 59, 0.05)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            width: '200px'
                        }}
                    >
                        <h2 style={{ marginBottom: '0.5rem' }}>Version 4</h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Opening Cocoon</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    )
}
