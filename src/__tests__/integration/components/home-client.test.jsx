import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeClient from "@/app/components/HomeClient";
import { renderWithProviders } from "@/test-utils/render";

jest.mock("@/app/components/Hero", () => () => <div>hero</div>);

jest.mock(
  "@/app/components/Header",
  () =>
    ({ cartList, onRemoveItem, onUpdateCartList }) => (
      <div>
        <div>cart items: {cartList.length}</div>
        {cartList.map((item) => (
          <div key={item.productId}>
            <span>
              {item.productName}: {item.quantity}
            </span>
            <button onClick={() => onUpdateCartList(item.productId, "minus")}>
              minus {item.productName}
            </button>
            <button onClick={() => onUpdateCartList(item.productId, "plus")}>
              plus {item.productName}
            </button>
            <button onClick={() => onRemoveItem(item.productId)}>
              remove {item.productName}
            </button>
          </div>
        ))}
      </div>
    ),
);

jest.mock("@/app/components/Navbar", () => ({ handleOnChange }) => (
  <div>
    <button
      onClick={() => handleOnChange({ target: { innerText: "TODOS" } }, 0)}
    >
      TODOS
    </button>
    <button
      onClick={() => handleOnChange({ target: { innerText: "ROSADO" } }, 1)}
    >
      ROSADO
    </button>
  </div>
));

jest.mock(
  "@/app/components/RadioFilters",
  () =>
    ({ houseOptions, handleOnChange }) => (
      <div>
        <div>
          house options:
          {houseOptions.map((option) => option.label).join(",")}
        </div>
        <button onClick={() => handleOnChange({ target: { value: "TODOS" } })}>
          house TODOS
        </button>
        <button
          onClick={() => handleOnChange({ target: { value: "house-a" } })}
        >
          house A
        </button>
        <button
          onClick={() => handleOnChange({ target: { value: "house-b" } })}
        >
          house B
        </button>
      </div>
    ),
);

jest.mock("@/app/components/WineCard", () => (props) => (
  <div>
    <span>{props.name}</span>
    <button
      onClick={() =>
        props.handleCartButton({
          productId: props.id,
          productName: props.name,
          productPrice: props.price,
          productImg: props.imageSrc,
          productCategory: "wine",
        })
      }
    >
      add {props.name}
    </button>
  </div>
));

jest.mock("@/app/components/MerchCard", () => ({ item, handleCartButton }) => (
  <div>
    <span>
      {item.name} - {item.variety}
    </span>
    <button
      onClick={() =>
        handleCartButton({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          productImg: item.imageURL,
          productCategory: "merch",
          productVariety: item.variety,
        })
      }
    >
      add merch {item.name}
    </button>
  </div>
));

jest.mock(
  "@/app/components/Snackbar",
  () =>
    ({ open, message }) =>
      open ? <div>{message}</div> : null,
);

const winesData = [
  {
    id: "wine-1",
    name: "Rosado Uno",
    house: "house-a",
    houseName: "Casa A",
    color: "rosado",
    price: 450,
    imageURL: "/assets/rosado-1.png",
  },
  {
    id: "wine-2",
    name: "Tinto Dos",
    house: "house-b",
    houseName: "Casa B",
    color: "tinto",
    price: 520,
    imageURL: "/assets/tinto-2.png",
  },
  {
    id: "wine-3",
    name: "Rosado Tres",
    house: "house-a",
    houseName: "Casa A",
    color: "rosado",
    price: 610,
    imageURL: "/assets/rosado-3.png",
  },
];

const merchData = [
  {
    id: "merch-1",
    imageURL: "/assets/playera.png",
    name: "Playera",
    price: 300,
    variety: "negra",
  },
];

describe("HomeClient", () => {
  it("builds unique house options and filters wines by house and color", async () => {
    renderWithProviders(
      <HomeClient winesData={winesData} merchData={merchData} />,
    );

    expect(screen.getByText("house options:Casa A,Casa B")).toBeInTheDocument();
    expect(screen.getByText("Rosado Uno")).toBeInTheDocument();
    expect(screen.getByText("Tinto Dos")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "house A" }));
    await user.click(screen.getByRole("button", { name: "ROSADO" }));

    expect(screen.getByText("Rosado Uno")).toBeInTheDocument();
    expect(screen.getByText("Rosado Tres")).toBeInTheDocument();
    expect(screen.queryByText("Tinto Dos")).not.toBeInTheDocument();
  });

  it("adds products to the cart, increments repeated items, and opens feedback", async () => {
    renderWithProviders(
      <HomeClient winesData={winesData} merchData={merchData} />,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "add Rosado Uno" }));
    await user.click(screen.getByRole("button", { name: "add Rosado Uno" }));

    expect(screen.getByText("cart items: 1")).toBeInTheDocument();
    expect(screen.getByText("Rosado Uno: 2")).toBeInTheDocument();
    expect(
      screen.getByText("Haz agregado un producto a tu carrito"),
    ).toBeInTheDocument();
  });

  it("updates quantities without going below one and removes items from the cart", async () => {
    renderWithProviders(
      <HomeClient winesData={winesData} merchData={merchData} />,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "add Rosado Uno" }));
    await user.click(screen.getByRole("button", { name: "plus Rosado Uno" }));
    expect(screen.getByText("Rosado Uno: 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "minus Rosado Uno" }));
    expect(screen.getByText("Rosado Uno: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "minus Rosado Uno" }));
    expect(screen.getByText("Rosado Uno: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "remove Rosado Uno" }));
    expect(screen.getByText("cart items: 0")).toBeInTheDocument();
    expect(screen.queryByText("Rosado Uno: 1")).not.toBeInTheDocument();
  });
});
