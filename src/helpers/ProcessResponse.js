const getDateTimeFromPII = (pii_entities) => pii_entities.filter(pii_entity => {
    return pii_entity.type === 'DateTime';
})[0]?.text || '';

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
                "OfficerName": data.Police_officer_Name[0] || 'Unknown',
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