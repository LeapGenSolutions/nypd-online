const getDateTimeFromPII = (pii_entities) =>pii_entities.filter(pii_entity =>{
        return pii_entity.type == 'DateTime'
    })[0].text
  
const fixBase64 = (str) => {
    return str.padEnd(str.length + (4 - (str.length % 4)) % 4, '=');
}


const processResponse = (results, searchValue) => {
    // console.log(results);
    
    return results.value.map((data) => {
        try {
            const LINK = fixBase64(data.metadata_storage_path)
            const fileName = data.metadata_storage_name
            const fileContent = " . . . . . . "+data.keyphrases.slice(0,5).join(" , ")+" . . . . . ."        
            return {
                "FileName": fileName,
                "LinktoTheFile": LINK.substring(0, LINK.length-1),
                "OfficerName": data.Police_officer_Name[0],
                "Date": getDateTimeFromPII(data.pii_entities),
                "FileContent":fileContent
            }
        } catch (error) {
            console.log("Some Error for the data ")
            console.log(data)
            console.log(error)
            return{}
        }
    })
}


export default processResponse