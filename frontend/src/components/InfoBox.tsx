function InfoBox()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }
    var userData = JSON.parse(_ud);
    //var userId = userData.id;
    var userName = userData.name;
    
    return(
        <div id="information">
            <div id="profName">
                <p>Name:</p>
                <p>{userName}</p>
            </div>
            <div id="profDescription" className="mt-2">
                <p>Description:</p>
                <p>I am a coder.</p>
            </div>
            <div id="profSkills" className="mt-2">
                <p>Skills:</p>
                <p>I have coding skills.</p>
            </div>
            <div id="profInterests" className="mt-2">
                <p>Interests:</p>
                <p>I am interested in coding.</p>
            </div>
        </div>
    );
}
export default InfoBox;