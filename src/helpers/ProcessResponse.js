const processResponse = (results, searchValue) => {
    return results.value.map((data) => {
        const LINK = atob(data.metadata_storage_path)
        let fileName_split = LINK.split("/")
        fileName_split = fileName_split[fileName_split.length -1].split("_")
        const fileName = fileName_split[fileName_split.length-1]
        const fileContent = " . . . . . . "+data.keyphrases.slice(0,5).join(" , ")+" . . . . . ."        
        return {
            "FileName": fileName,
            "LinktoTheFile": LINK,
            "OfficerName": data.Police_Officer_Name[0],
            "Date": data.Extracted_Dates[0],
            "FileContent":fileContent
        }
    })
}

export default processResponse