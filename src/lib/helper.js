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