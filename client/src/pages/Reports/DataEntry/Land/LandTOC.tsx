import TableOfContents from "../../../../components/Forms/TableOfContents";


const LandTOC = () => {
    const contents = [
        { title: "Table 1", name : "Land Area", url : "/app/land/land_1" },
        { title: "Table 2", name : "Patrimonial Properties as of CY 2023", url : "/app/land/land_2" },
        { title: "Table 3", name : "Residential Free Patent Issued", url : "/app/land/land_3" },
        { title: "Table 4", name : "Agricultural Free Patent Issued", url : "/app/land/land_4" },
        { title: "Table 5", name : "Homestead", url : "/app/land/land_5" },
        { title: "Table 6", name : "List of Special Patent of LGUs and NGAs", url : "/app/land/land_6" },
        { title: "Table 7", name : "Management of Foreshore Areas", url : "/app/land/land_7" },
    ]
    return (
        <>
            <TableOfContents contents={contents} />
        </>
    )
}

export default LandTOC;