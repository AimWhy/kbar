import { createAction } from "../utils";
import type { Action } from "../types";
import { ActionImpl } from "./ActionImpl";

const perform = jest.fn();
const baseAction: Action = createAction({
  name: "Test action",
  perform,
});

describe("ActionImpl", () => {
  it("should deserialize given json", () => {
    const action = ActionImpl.fromJSON(createAction(baseAction));
    expect(action instanceof ActionImpl).toBe(true);
  });

  it("should be able to add children", () => {
    const parent = ActionImpl.fromJSON(createAction({ name: "parent" }));

    expect(parent.children).toEqual([]);

    const child = ActionImpl.fromJSON(
      createAction({ name: "child", parent: parent.id }),
      { parent }
    );

    parent.addChild(child);

    expect(parent.children[0]).toEqual(child);
  });

  it("should be able to get ancestors", () => {
    const parent = ActionImpl.fromJSON(createAction({ name: "parent" }));
    const child = ActionImpl.fromJSON(
      createAction({ name: "child", parent: parent.id }),
      { parent }
    );
    const grandchild = ActionImpl.fromJSON(
      createAction({ name: "grandchild", parent: child.id }),
      { parent: child }
    );

    expect(parent.ancestors.length).toEqual(0);

    expect(child.ancestors.length).toEqual(1);
    expect(child.ancestors[0]).toEqual(parent);

    expect(grandchild.ancestors.length).toEqual(2);
    expect(grandchild.ancestors[0]).toEqual(parent);
    expect(grandchild.ancestors[1]).toEqual(child);
  });

  it("should be able to get children", () => {
    const parent = ActionImpl.fromJSON(createAction({ name: "parent" }));
    const child = ActionImpl.fromJSON(
      createAction({ name: "child", parent: parent.id }),
      { parent }
    );
    const grandchild = ActionImpl.fromJSON(
      createAction({ name: "grandchild", parent: child.id }),
      { parent: child }
    );

    expect(parent.children.length).toEqual(1);
    expect(child.children.length).toEqual(1);
    expect(grandchild.children.length).toEqual(0);
  });
});
