export const simpleSequenceToEntitySequence = (simpleSeq) => {
  const entSeq = []
  let charsPassed = 0
  for (const seq of simpleSeq || []) {
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
    (relationships || []).flatMap((r) => [r.from, r.to])
  )

  const entSeq = []
  let charsPassed = 0
  for (const seq of simpleSeq || []) {
    if (seq.label || (seq.textId && textIdsInRelation.has(seq.textId))) {
      entSeq.push({
        text: seq.text,
        textId: seq.textId,
        label: seq.label,
        start: charsPassed,
        end: charsPassed + seq.text.length - 1,
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
        textId:
          entSeq[nextEntity].textId || Math.random().toString(36).slice(-6),
      })
      // i = entSeq[nextEntity].end
      i += entSeq[nextEntity].text.length - 1
      simpleSeq.push({ text: "" })
      nextEntity += 1
    } else {
      if (simpleSeq.length === 0 || simpleSeq[simpleSeq.length - 1].label) {
        simpleSeq.push({
          text: doc[i],
          textId: Math.random().toString(36).slice(-6),
        })
      } else {
        simpleSeq[simpleSeq.length - 1].text += doc[i]
      }
    }
  }
  if (simpleSeq.map((s) => s.text).join("") !== doc) {
    throw new Error(
      "Combining annotation entities with document didn't match document.\n\n" +
        simpleSeq.map((s) => s.text).join("") +
        "\n\nvs\n\n" +
        doc
    )
  }
  return simpleSeq.filter((item) => item.text.length > 0)
}
