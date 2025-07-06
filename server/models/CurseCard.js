class CurseCard {
  constructor({
    id,
    name,
    description,
    effect,
    applyEffect,
    effectText,
    type = 'curse'
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.type = type;

    this._applyEffect = applyEffect;
    this._effectText = effectText;
  }

  applyEffect(targetPlayer, context) {
    if (typeof this._applyEffect === 'function') {
      this._applyEffect(targetPlayer, context);
    }
  }

  getEffectText(targetPlayer) {
    if (typeof this._effectText === 'function') {
      return this._effectText(targetPlayer);
    }
    return `${targetPlayer.username} foi afetado por uma maldição!`;
  }
}

module.exports = CurseCard;
