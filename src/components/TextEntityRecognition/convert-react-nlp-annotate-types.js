export const simpleSequenceToEntitySequence = (simpleSeq) => {
  const entSeq = []
  let charsPassed = 0
  for (const seq of simpleSeq) {
    if (seq.label) {
      entSeq.push({
        text: seq.text,
        label: seq.label,
        start: charsPassed,
        end: charsPassed + seq.text.length,
      })
    }
    charsPassed += seq.text.length
  }
  return entSeq
}

export const simpleSequenceAndRelationsToEntitySequence = ({
  sequence: simpleSeq,
  relationships,
}) => {
  const textIdsInRelation = new Set(
    simpleSeq.flatMap((seq) => [seq.from, seq.to])
  )

  const entSeq = []
  let charsPassed = 0
  for (const seq of simpleSeq) {
    if (seq.label || textIdsInRelation.has(seq.textId)) {
      entSeq.push({
        text: seq.text,
        textId: seq.textId,
        label: seq.label,
        start: charsPassed,
        end: charsPassed + seq.text.length,
      })
    }
    charsPassed += seq.text.length
  }
  return { entities: entSeq, relations: relationships }
}

export const entitySequenceToSimpleSeq = (doc, entSeq) => {
  if (!entSeq) return undefined
  const simpleSeq = []
  entSeq = [...entSeq]
  entSeq.sort((a, b) => a.start - b.start)
  let nextEntity = 0
  for (let i = 0; i < doc.length; i++) {
    if ((entSeq[nextEntity] || {}).start === i) {
      simpleSeq.push({
        text: entSeq[nextEntity].text,
        label: entSeq[nextEntity].label,
        textId: entSeq[nextEntity].textId,
      })
      i = entSeq[nextEntity].end
      simpleSeq.push({ text: "" })
      nextEntity += 1
    } else {
      if (simpleSeq.length === 0 || simpleSeq[simpleSeq.length - 1].label) {
        simpleSeq.push({ text: doc[i] })
      } else {
        simpleSeq[simpleSeq.length - 1].text += doc[i]
      }
    }
  }
  return simpleSeq.filter((item) => item.text.length > 0)
}
