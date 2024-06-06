import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './../css/App.css';
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();
  return (
   <div className ='App'>
    
	<header className="App-header">
	<div className="max-w-md text-center">
			<h1 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
				<span className="sr-only ">Error</span>404
			</h1>
			<p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
			<p className="mt-4 mb-8 dark:text-gray-600">But dont worry, you can find plenty of other things on our homepage.</p>
			<button className="btn btn-secondary btn-lg mt-3" onClick={()=>navigate('/')}>Back to homepage</button>
		</div>
    </header>
	
	

   </div>
  );
}