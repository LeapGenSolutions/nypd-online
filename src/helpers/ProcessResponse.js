const getDateTimeFromPII = (pii_entities,fileName) => {
    let parsed_dateTimes = pii_entities.filter(pii_entity => {
        return pii_entity.type === 'DateTime';
    })
    let parsed_dateTime = parsed_dateTimes[0]?.text || '';
    let dateTime = parsed_dateTime.replaceAll("."," ")
    dateTime = dateTime.replaceAll(","," ")
    const dateTimeSplit = dateTime.split(" ").filter(x=>x != "")
    let year = ""
    let month = ""
    let date = ""   
    if(dateTimeSplit.length == 2){
        month = dateTimeSplit[0]
        date = dateTimeSplit[1]
        year = fileName.substring(0,4) 
    }
    if(dateTimeSplit.length == 3){
        year = dateTimeSplit[2]
        month = dateTimeSplit[0]
        date = dateTimeSplit[1]    
    }
    
    let final_date = ""
    try {        
        final_date = new Date(month+" "+date+", "+year)
    } catch (error) {
        final_date = new Date("January 1, 2000")
    }
    return final_date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const getPoliceOfficerName = (texts) => {
    for(let i=1;i<texts.length;i++){
        let text_ele = texts[i]
        if(text_ele.startsWith("POLICE OFFICER")){
            return text_ele.split(" ").slice(2,4).join(" ")
        }
        if(text_ele.startsWith("POLICE ADMINISTRATIVE")){
            return text_ele.split(" ").slice(2,4).join(" ")
        }
        if(text_ele.startsWith("DETECTIVE")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("CAPTAIN")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("SERGEANT")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("LIEUTENANT")){
            return text_ele.split(" ").slice(1,3).join(" ")
        }
        if(text_ele.startsWith("INSPECTOR")){
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
            let dateTime = getDateTimeFromPII(data.pii_entities,fileName);
            if(dateTime == "Invalid Date"){
                dateTime = "January 1, "+fileName.substring(0,4)
            }
            const year = dateTime.split(", ")[1].trim()
            let police_officer_name = getPoliceOfficerName(data.text)
            if(police_officer_name == "No Police Officer"){
                police_officer_name = data.Police_officer_Name[0]
                console.log("No Police Office found. Replacing it with "+police_officer_name);
                console.log(LINK);                                
            }
            return {
                "FileName": fileName,
                "LinktoTheFile": LINK,
                "OfficerName": police_officer_name,
                "Date": dateTime,
                "FileContent": fileContent,
                "Year":year
            };
        } catch (error) {
            console.error("Error processing data:", error, data);
            return null;
        }
    }).filter((data)=>data.Date != "Invalid Date" || fileName.toString().endsWith(".pdf"));
    processedData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    return processedData;
};

export default processResponse;