import "./Navbar.scss"

const Navbar = () => {
    return (
        <nav className="nav">
            <div className="nav__wrapper">
                <h1 className="nav__title">QR Code Generator</h1>
                <p className="nav__createdBy">Created by <a href="https://janoskocs.com" target="_blank">@janoskocs</a></p>
            </div>
        </nav>
    )
}

export default Navbar