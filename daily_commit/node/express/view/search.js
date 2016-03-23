<h1>the result is <%=seach%></h1>
    <p>please enter your search term: </p>
    <%
	if(results.length){%>
        <ul>
            <%for (var i =0;i<results.length;i++){%>
                <li>
                    <%=results[i].text%> -
                        <%=results[i].from_user%>
                </li>
                <%}%>
        </ul>
        <%}else{
		<p> No result</p>
	}
  	%>