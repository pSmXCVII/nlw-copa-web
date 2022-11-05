import Image from "next/image";

import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarImg from "../assets/users-avatar-example.png";
import checkIconImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [newPoolTitle, setNewPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: newPoolTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      alert(
        `Bolão criado com sucesso! Código "${code}" copiado para área de transferência.`
      );

      setNewPoolTitle("");
    } catch (error) {
      console.log(error);
      alert("Falha ao criar o bolão");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="Logo NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2 ">
          <Image src={usersAvatarImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(e) => setNewPoolTitle(e.target.value)}
            value={newPoolTitle}
          />
          <button
            className="bg-nlwYellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-nlwYellow-600"
            type="submit"
          >
            CRIAR MEU BOLÃO
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares com prévia da aplicação mobile."
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
