import '../../Styles/Navbar/navbar.css';
import BurgerMenu from "./burger_menu.component";
import ScribbleText from "../UI/ui_scribble_text.component";

const Navbar = () => {
    return (
            <div className="navbar-title-container">
                <div className="navbar-title-background">
                    <div className="navbar-title-text">
                        <ScribbleText
                            text={"Colour my journey"}
                            roughness={1.5}
                            fillColor={"#00a4d7"}
                            strokeColor={"#027a9f"}
                            strokeWidth={3}
                        />
                    </div>
                </div>
        </div>
    );
};

export default Navbar;
