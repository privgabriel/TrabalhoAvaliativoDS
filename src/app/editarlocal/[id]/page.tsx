"use client";

import { ref, onValue, update } from "firebase/database";
import {auth, db} from "../../../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams, useRouter } from "next/navigation";
import {useAuthContext} from "@/context/AuthContext";
import {onAuthStateChanged} from "firebase/auth";

interface IUserParams extends Params {
    id: string;
}

interface IPlace {
    nome: string;
    endereco: string;
    situacao: string;
}

export default function Home() {
    const router = useRouter();
    const params: IUserParams = useParams();
    const { id } = params;
    const [place, setPlace] = useState<IPlace>({
        nome: "",
        endereco: "",
        situacao: "",
    });

    const [authUser, setAuthUser] = useState(null);
    const { userAuth } = useAuthContext();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado: ", user.uid);
                setAuthUser(user);
                router.push("/");
            } else {
                console.log("Usuário deslogado");
                setAuthUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            const unsubscribe = onValue(ref(db, `/locais/${id}`), (querySnapShot) => {
                const placeData: IPlace = querySnapShot.val() || {};
                console.log(placeData);
                setPlace(placeData);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, []);

    const editPlace = () => {
        update(ref(db, `/locais/${id}`), place);
        setPlace({ nome: "", endereco: "", situacao: "" });
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="max-w-md mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editPlace();
                    }}
                >
                    <div className="mb-4">
                        <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                            Editar local
                        </h2>
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="nome"
                        >
                            Nome:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="nome"
                            type="text"
                            placeholder="Nome"
                            value={place.nome}
                            onChange={(e) => setPlace({ ...place, nome: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="endereco"
                        >
                            Endereço:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="endereco"
                            type="text"
                            placeholder="Endereço"
                            value={place.endereco}
                            onChange={(e) => setPlace({ ...place, endereco: e.target.value })}
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="situacao"
                        >
                            Situação:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="situacao"
                            type="text"
                            placeholder="Situação"
                            value={place.situacao}
                            onChange={(e) => setPlace({ ...place, situacao: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}