
function ProjectSearch()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    return(
        <div id="searchBox" className="searchBox">
            <div id="searchArea">
                <input type="text" id="searchBar" placeholder="Search Projects" />
                <button type="button" id="searchButton" className="searchButton">Search</button>
            </div>
            <div id="searchResults" className="searchResults">
                <p>TEST</p>
            </div>
        </div>

    );
}
export default ProjectSearch;