"use client";

import { ref, onValue, remove } from "firebase/database";
import { db } from "../../../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams } from "next/navigation";

interface IUserParams extends Params {
    id: string;
}

interface IMetas {
    [key: string]: {
        tipo: string;
        data_conclusao: string;
        data_inicio: string;
        descricao: string;
        status: string;
        titulo: string;
    };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState<IMetas>({});
    const params: IUserParams = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchData = () => {
            const unsubscribe = onValue(ref(db, `/metas/${id}`), (querySnapShot) => {
                const metasData: IMetas = querySnapShot.val() || {};
                console.log(metasData);
                setMetas(metasData);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 m-12">
                {!loading && (
                    <div key={id} className="relative py-3">
                        <div className="max-w-md mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                    {loading ? "Carregando..." : `${metas.titulo}`.toUpperCase()}
                                </h2>
                                <div className="my-4">
                                    <p className="text-gray-700">{`ID: ${id}`}</p>
                                    <p className="text-gray-700">{`Tipo: ${metas.tipo}`}</p>
                                    <p className="text-gray-700">{`Data de Início: ${metas.data_inicio}`}</p>
                                    <p className="text-gray-700">{`Data de Conclusão: ${metas.data_conclusao}`}</p>
                                    <p className="text-gray-700">{`Descrição: ${metas.descricao}`}</p>
                                    <p className="text-gray-700">{`Status: ${metas.status}`}</p>
                                    <div className="flex justify-center space-x-4 mt-4">
                                        <Link href={`/`}>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                                Voltar
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}