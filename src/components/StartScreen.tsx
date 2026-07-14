export default function StartScreen({
  hasSave,
  onStart,
  onContinue,
}: {
  hasSave: boolean
  onStart: () => void
  onContinue: () => void
}) {
  return (
    <div className="start-screen">
      <div className="start-fog" />
      <h1 className="start-title">Тумани Волмур-Голлоу</h1>
      <p className="start-subtitle">Містична детективна пригода</p>
      <div className="start-buttons">
        {hasSave && (
          <button className="start-btn primary" onClick={onContinue}>
            Продовжити розслідування
          </button>
        )}
        <button className="start-btn" onClick={onStart}>
          {hasSave ? 'Почати заново' : 'Почати гру'}
        </button>
      </div>
      <p className="start-hint">WASD / стрілки — рух · E — взаємодія · Дослідіть кожен куток</p>
    </div>
  )
}
