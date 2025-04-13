

function ProjectPreview()
{
    
    const close = (event: React.MouseEvent) =>
    {
        event.preventDefault()
        var t = document.getElementById("projPreview");
        if(t == null)   return;
        t.style.display = "none"
    }

    return(
        <span id="projPreview" className="projPreview">
            <button type="button" className="closeButton" onClick={close}>Close</button>
            <h1 className="text-center">Name</h1>
            <p>Number of members</p>
            <p>Description here</p>
            <button type="button" className="applyButton">Apply</button>
        </span>
    );
}
export default ProjectPreview;