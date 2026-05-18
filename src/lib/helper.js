
const EN_TO_MR = {
    home: "मुख्यपृष्ठ",
    maharashtra: "महाराष्ट्र",
    pune: "पुणे",
    politics: "राजकारण",
    crime: "गुन्हेगारी",
    entertainment: "मनोरंजन",
    sports: "क्रीडा",
    business: "व्यवसाय",
    nation: "देश",
    world: "जग",
};

const MR_TO_EN = {
    मुख्यपृष्ठ: "home",
    महाराष्ट्र: "maharashtra",
    पुणे: "pune",
    राजकारण: "politics",
    गुन्हेगारी: "crime",
    मनोरंजन: "entertainment",
    क्रीडा: "sports",
    व्यवसाय: "business",
    देश: "nation",
    जग: "world",
};

export const slugToMarathi = (word) => {
    if (!word) return "";

    return EN_TO_MR[word] || word;
};


export const slugToEnglish = (word) => {
    if (!word) return "";

    return MR_TO_EN[word.toLowerCase()] || word;
};

export const getShortName = (fullName) => {
    if (!fullName) return "";

    const words = fullName.trim().split(" ");

    if (words.length < 2) {
        return words[0]?.slice(0, 2) || "";
    }

    const firstName = words[0].slice(0, 2);
    const lastName = words[words.length - 1].slice(0, 2);

    return firstName + lastName;
};

// utils/timeAgo.js

export function timeAgo(timestamp) {
    if (!timestamp) return ''

    const now = new Date()
    const past = new Date(timestamp)

    const seconds = Math.floor((now - past) / 1000)

    if (seconds < 60) {
        return `${seconds} सेकंदांपूर्वी`
    }

    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
        return `${minutes} मिनिटांपूर्वी`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours} तासांपूर्वी`
    }

    const days = Math.floor(hours / 24)

    if (days < 30) {
        return `${days} दिवसांपूर्वी`
    }

    const months = Math.floor(days / 30)

    if (months < 12) {
        return `${months} महिन्यांपूर्वी`
    }

    const years = Math.floor(months / 12)

    return `${years} वर्षांपूर्वी`
}

// utils/marathiDate.js

const marathiMonths = [
    'जानेवारी',
    'फेब्रुवारी',
    'मार्च',
    'एप्रिल',
    'मे',
    'जून',
    'जुलै',
    'ऑगस्ट',
    'सप्टेंबर',
    'ऑक्टोबर',
    'नोव्हेंबर',
    'डिसेंबर'
]

const marathiNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

function convertToMarathiNumberInFun(value) {
    return String(value)
        .split('')
        .map(char =>
            /\d/.test(char)
                ? marathiNumbers[Number(char)]
                : char
        )
        .join('')
}

export function convertToMarathiNumber(value) {
    return String(value)
        .split('')
        .map(char =>
            /\d/.test(char)
                ? marathiNumbers[Number(char)]
                : char
        )
        .join('')
}

export function formatMarathiDate(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)

    const day = convertToMarathiNumberInFun(date.getDate())
    const month = marathiMonths[date.getMonth()]

    return `${day} ${month}`
}

export function formatMarathiDateFull(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)

    const day = convertToMarathiNumberInFun(date.getDate())
    const month = marathiMonths[date.getMonth()]
    const year = convertToMarathiNumberInFun(date.getFullYear())

    return `${day} ${month}, ${year}`
}

// utils/getCategoryNames.js

export function getCategoryNames(categoryIds, categories = []) {
    if (!categoryIds || !categories?.length) {
        return []
    }

    const ids = Array.isArray(categoryIds)
        ? categoryIds
        : String(categoryIds)
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)

    const names = ids
        .map((id) => {
            const category = categories.find(
                (cat) => String(cat.id) === String(id)
            )

            return category ? category.name : null
        })
        .filter(Boolean)

    return ids.length === 1 ? names[0] || '' : names
}

export function getCategoryNamesEnglish(categoryIds, categories = []) {
    console.log('getCategoryNamesEnglish called with:', { categoryIds })
    if (!categoryIds || !categories?.length) {
        return []
    }

    const ids = Array.isArray(categoryIds)
        ? categoryIds
        : String(categoryIds)
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)

    const names = ids
        .map((id) => {
            const category = categories.find(
                (cat) => String(cat.id) === String(id)
            )

            return category?.nameEnglish?.toLowerCase() || null
        })
        .filter(Boolean)

    return ids.length === 1 ? names[0] || '' : names
}