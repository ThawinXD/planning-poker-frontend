
export default function Player({name, size, x, y}: {name: string; size: number; x: number; y: number}) {
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-300"
      style={{
        transform: `translate(${x}px, ${y}px) translate(0%, 0%)`,
      }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <img src="/avatar.svg" alt="Avatar" className="w-full h-full"/>
        <p
          style={{
            marginTop: size * 0.1,
            fontSize: size * 0.35,
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {name}
        </p>
      </div>
      {/* <p>{name} - {isVoted ? "Voted" : "Not Voted"} - {cardPicked || "No card picked"}</p> */}
    </div>
  )
}