export default function IconButton({ icon, onClick, title, bgColor = '', ariaLabel }) {
    return (
        <div
            className={`p-1 rounded-md ${bgColor} cursor-pointer`}
            title={title}
            role="button"
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {icon}
        </div>
    )
}
