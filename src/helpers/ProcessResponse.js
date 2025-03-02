const getDateTimeFromPII = (pii_entities) => pii_entities.filter(pii_entity => {
    return pii_entity.type === 'DateTime';
})[0]?.text || '';

const getPoliceOfficerName = (texts) => {
    for(let i=2;i<texts.length;i++){
        let text_ele = texts[i]
        if(text_ele.startsWith("POLICE OFFICER")){
            return text_ele.split(" ").slice(2,4).join(" ")
        }
        if(text_ele.startsWith("DETECTIVE")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("CAPTAIN")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("SERGENT")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
    }
    return "No Police Officer"
}

const processResponse = (results, searchValue) => {
    
    const processedData = results.value.map((data) => {
        try {
            const LINK = "https://nypdonline.org/files/" + data.metadata_storage_name;
            const fileName_unsplitted = data.metadata_storage_name.split("_");
            const fileName = fileName_unsplitted[fileName_unsplitted.length - 1];
            const fileContent = " . . . . . . " + data.keyphrases.slice(0, 50).join(" , ") + " . . . . . .";
            const dateTime = getDateTimeFromPII(data.pii_entities);
            return {
                "FileName": fileName,
                "LinktoTheFile": LINK,
                "OfficerName": getPoliceOfficerName(data.text),
                "Date": dateTime,
                "FileContent": fileContent
            };
        } catch (error) {
            console.error("Error processing data:", error, data);
            return null;
        }
    }).filter(Boolean);
    processedData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    return processedData;
};

export default processResponse;