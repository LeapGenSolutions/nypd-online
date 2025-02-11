const processResponse = (results, searchValue) => {
    return results.value.map((data) => {
        const LINK = atob(data.metadata_storage_path)
        let fileName_split = LINK.split("/")
        fileName_split = fileName_split[fileName_split.length -1].split("_")
        const fileName = fileName_split[fileName_split.length-1]
        const fileContent = " . . . . . . "+data.keyphrases.slice(0,5).join(" , ")+" . . . . . ."        
        return {
            "FileName": fileName.substring(0,fileName.length-1),
            "LinktoTheFile": LINK.substring(0, LINK.length-1),
            "OfficerName": data.Police_Officer_Name[0],
            "Date": data.Extracted_Dates[0],
            "FileContent":fileContent
        }
    })
}

export default processResponse