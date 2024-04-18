import React,{Component} from 'react';
import { Link } from 'react-router-dom';

class Load extends Component {
    render() {
        return (
            <div className="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3">
                <div className="snippet mt-2 ms-auto me-auto" data-title=".dot-typing">
                    <div className="stage">
                        <Link to="/userpage">
                        <button className="dot-typing"></button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Load;