export default function ApplianceRow({ appliance, index, showLabels, onUpdate, onRemove, small = false }) {
  return (
    <div className={small ? 'sim-appliance-row' : 'appliance-row'}>
      <div className="field">
        {showLabels && <label>Aparelho</label>}
        <input type="text" placeholder="ex: Geladeira" value={appliance.name}
          onChange={e => onUpdate(index, 'name', e.target.value)} />
      </div>
      <div className="field">
        {showLabels && <label>Watts</label>}
        <input type="number" placeholder="150" min="0" value={appliance.watts}
          onChange={e => onUpdate(index, 'watts', e.target.value)} />
      </div>
      <div className="field">
        {showLabels && <label>h/dia</label>}
        <input type="number" placeholder="24" min="0" max="24" value={appliance.hoursPerDay}
          onChange={e => onUpdate(index, 'hoursPerDay', e.target.value)} />
      </div>
      <div className={showLabels ? 'btn-remove-wrap btn-remove-wrap--offset' : 'btn-remove-wrap'}>
        <button className="btn-remove" onClick={() => onRemove(index)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
