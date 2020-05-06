// @flow weak
import test from "ava"
import Handler from "./handler.js"
import makeImmutable from "seamless-immutable"

const { setIn } = makeImmutable

test("collaboration session reconciliation - single user", async (t) => {
  const handler = new Handler({
    serverUrl: "https://udt-collaboration.workaround.now.sh",
    userName: "user1",
  })

  let s1 = makeImmutable({
    interface: {
      type: "image_classification",
    },
    samples: [
      { imageUrl: "https://example.com/image1.jpg" },
      { imageUrl: "https://example.com/image2.jpg" },
      { imageUrl: "https://example.com/image3.jpg" },
    ],
  })
  await handler.createSession(s1)

  t.assert((await handler.sendPatchIfChanged(s1)) === null)

  let latestState = await handler.getLatestState()

  t.deepEqual(latestState.state, s1)

  let latestPatch = await handler.applyLatestPatches()

  t.assert(latestPatch === null)

  const s2 = setIn(s1, ["taskOutput"], [null, null, null])

  t.assert((await handler.sendPatchIfChanged(s2)) !== null)
  latestPatch = await handler.applyLatestPatches()

  t.assert(latestPatch === null)
})

test("collaboration session reconciliation - two users", async (t) => {
  const h1 = new Handler({
    serverUrl: "https://udt-collaboration.workaround.now.sh",
    userName: "user1",
  })
  const h2 = new Handler({
    serverUrl: "https://udt-collaboration.workaround.now.sh",
    userName: "user2",
  })

  let s1 = makeImmutable({
    interface: {
      type: "image_classification",
    },
    samples: [
      { imageUrl: "https://example.com/image1.jpg" },
      { imageUrl: "https://example.com/image2.jpg" },
      { imageUrl: "https://example.com/image3.jpg" },
    ],
  })
  await h1.createSession(s1)
  await h2.joinSession(h1.sessionId)

  const s2 = setIn(s1, ["taskOutput"], [null, null, null])

  t.assert((await h1.sendPatchIfChanged(s2)) !== null)

  let latestH2Patch = await h2.applyLatestPatches()

  t.assert(latestH2Patch !== null)
})
