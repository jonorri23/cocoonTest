import { v4 as uuidv4 } from 'uuid';
import { members } from './members';

// Add placeholder artworks to each member
const membersWithArtworks = members.map(member => ({
    ...member,
    artworks: [
        {
            id: uuidv4(),
            name: 'Creation Alpha',
            color: member.color,
            type: 'dodecahedron'
        },
        {
            id: uuidv4(),
            name: 'Vision Beta',
            color: adjustColorBrightness(member.color, 20),
            type: 'tetrahedron'
        },
        {
            id: uuidv4(),
            name: 'Dream Gamma',
            color: adjustColorBrightness(member.color, -20),
            type: 'octahedron'
        }
    ]
}));

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// Moon categories that orbit the cocoon
export const moons = [
    {
        id: 'members',
        name: 'Members',
        color: '#a8e6cf',
        type: 'sphere',
        size: 0.8,
        children: membersWithArtworks,
        childrenType: 'artworks',
        description: 'The creative souls of Cocoon'
    },
    {
        id: 'projects',
        name: 'Projects',
        color: '#ffd3b6',
        type: 'torus',
        size: 0.7,
        children: [
            {
                id: uuidv4(),
                name: 'Northern Lights Installation',
                color: '#7ec8e3',
                description: 'Immersive light experience',
                artworks: [
                    { id: uuidv4(), name: 'Sketch 1', color: '#7ec8e3', type: 'sphere' },
                    { id: uuidv4(), name: 'Sketch 2', color: '#5ab3d6', type: 'dodecahedron' }
                ]
            },
            {
                id: uuidv4(),
                name: 'Volcanic Soundscape',
                color: '#f48fb1',
                description: 'Audio-reactive volcanic display',
                artworks: [
                    { id: uuidv4(), name: 'Wave 1', color: '#f48fb1', type: 'tetrahedron' },
                    { id: uuidv4(), name: 'Wave 2', color: '#e91e63', type: 'octahedron' }
                ]
            }
        ],
        childrenType: 'assets',
        description: 'Collaborative creative endeavors'
    },
    {
        id: 'gallery',
        name: 'Gallery',
        color: '#ffaaa5',
        type: 'octahedron',
        size: 0.75,
        children: [
            {
                id: uuidv4(),
                name: 'Ethereal Collection',
                color: '#ce93d8',
                artworks: [
                    { id: uuidv4(), name: 'Piece 1', color: '#ce93d8', type: 'sphere' },
                    { id: uuidv4(), name: 'Piece 2', color: '#ba68c8', type: 'dodecahedron' }
                ]
            },
            {
                id: uuidv4(),
                name: 'Digital Dreams',
                color: '#80deea',
                artworks: [
                    { id: uuidv4(), name: 'Dream 1', color: '#80deea', type: 'tetrahedron' },
                    { id: uuidv4(), name: 'Dream 2', color: '#4dd0e1', type: 'octahedron' }
                ]
            }
        ],
        childrenType: 'pieces',
        description: 'Curated artistic exhibitions'
    },
    {
        id: 'events',
        name: 'Events',
        color: '#b39ddb',
        type: 'torusKnot',
        size: 0.6,
        children: [
            {
                id: uuidv4(),
                name: 'Summer Solstice Gathering',
                color: '#ffb74d',
                artworks: [
                    { id: uuidv4(), name: 'Memory 1', color: '#ffb74d', type: 'sphere' }
                ]
            },
            {
                id: uuidv4(),
                name: 'Winter Equinox Ritual',
                color: '#81c784',
                artworks: [
                    { id: uuidv4(), name: 'Memory 2', color: '#81c784', type: 'dodecahedron' }
                ]
            }
        ],
        childrenType: 'memories',
        description: 'Community gatherings and experiences'
    }
];

export const orbitalData = {
    moons,
    members: membersWithArtworks
};
