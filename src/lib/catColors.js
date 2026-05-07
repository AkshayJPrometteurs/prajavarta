export const CAT_COLORS = {
    Maharashtra: 'var(--cat-maharashtra)',
    'महाराष्ट्र': 'var(--cat-maharashtra)',
    Pune: 'var(--cat-pune)',
    'पुणे': 'var(--cat-pune)',
    Politics: 'var(--cat-politics)',
    'राजकारण': 'var(--cat-politics)',
    Crime: 'var(--cat-crime)',
    'गुन्हेगारी': 'var(--cat-crime)',
    Entertainment: 'var(--cat-entertainment)',
    'मनोरंजन': 'var(--cat-entertainment)',
    Sports: 'var(--cat-sports)',
    'क्रीडा': 'var(--cat-sports)',
    Business: 'var(--cat-business)',
    'व्यवसाय': 'var(--cat-business)',
    National: 'var(--cat-national)',
    'देश': 'var(--cat-national)',
}

export function catColor(name) {
    return CAT_COLORS[name] || 'var(--brand-primary)'
}