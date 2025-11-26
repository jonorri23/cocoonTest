import { motion } from 'framer-motion';

export default function NavigationBreadcrumb({ navigationPath, onNavigate }) {
    if (navigationPath.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                position: 'absolute',
                top: '5rem',
                left: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-main)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.7)',
                zIndex: 100,
                pointerEvents: 'auto'
            }}
        >
            {/* Root/Home */}
            <motion.span
                whileHover={{ color: 'white', scale: 1.05 }}
                onClick={() => onNavigate(-1)}
                style={{
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s'
                }}
            >
                Cocoon
            </motion.span>

            {navigationPath.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ opacity: 0.3 }}>›</span>
                    <motion.span
                        whileHover={{
                            color: 'white',
                            scale: index < navigationPath.length - 1 ? 1.05 : 1
                        }}
                        onClick={() => {
                            if (index < navigationPath.length - 1) {
                                onNavigate(index);
                            }
                        }}
                        style={{
                            cursor: index < navigationPath.length - 1 ? 'pointer' : 'default',
                            color: index === navigationPath.length - 1
                                ? 'white'
                                : 'rgba(255,255,255,0.5)',
                            fontWeight: index === navigationPath.length - 1 ? '600' : '400',
                            transition: 'all 0.2s'
                        }}
                    >
                        {item.name}
                    </motion.span>
                </div>
            ))}
        </motion.div>
    );
}
