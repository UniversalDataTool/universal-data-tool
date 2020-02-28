import React from "react"
import { storiesOf } from "@storybook/react"

import ConfigureInterface from './'

storiesOf("ConfigureInterface", module).add("Basic Gui", () => (
    <ConfigureInterface
        onChange={e => e}
        iface={{}}        
    />
))
