export default function BookingHeader({title , desc}) {
    return <div className="text-center mb-8">
        <h2 className="text-2xl mb-2 font-bold">{title}</h2>
        <p className="text-gray-900">{desc}</p>
    </div>
}
