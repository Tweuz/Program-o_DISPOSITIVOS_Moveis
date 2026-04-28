import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Linking,
  Image,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- FIREBASE ---
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ==================== DIAS DA SEMANA ====================
const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];


const PASTORAIS_DATA = [
  {
    id: '1',
    nome: 'Pastoral da Via Sacra',
    descricao: 'A Pastoral da Via Sacra evangeliza pela encenação da Paixão e morte de Jesus Cristo nas ruas da cidade. Nossa missão funciona intensamente no período da Quaresma, preparando atores, figurinos, cenários complexos, divulgação e toda a logística de cozinha e autorizações governamentais. Para participar, o fiel deve se integrar às reuniões preparatórias que começam sempre antes do carnaval. Nossos encontros ocorrem aos sábados que antecedem a Semana Santa, unindo arte e fé.',
    corCamiseta: '#EF4444', 
    nomeCor: 'Vermelha',
    // Link ultra estável (Natureza/Religioso simbólico)
    imagem: { uri: 'https://picsum.photos/id/1015/600/400' }, 
    imagemLista: { uri: 'https://picsum.photos/id/1015/150/150' },
  },
  {
    id: '2',
    nome: 'Liturgia Infantil',
    setor: 'Setor Litúrgico',
    descricao: 'Esta pastoral cuida do serviço litúrgico na Missa dominical das 09:00, promovendo a evangelização e a formação lúdica das crianças paroquianas. A equipe realiza os cantos, as leituras, o salmo, o ofertório e encenações bíblicas adaptadas. Para participar, a criança deve ter no mínimo 8 anos, autorização dos pais e disponibilidade para o serviço atribuído. Os encontros são semanais, todos os sábados, das 10:00 às 12:00 no salão paroquial.',
    corCamiseta: '#3B82F6', 
    nomeCor: 'Azul Celeste',
    imagem: { uri: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=500' },
    imagemLista: { uri: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=150' },
  },
  {
    id: '3',
    nome: 'PASCOM',
    setor: 'Setor Comunicação',
    descricao: 'A Pastoral da Comunicação é o conjunto de ações que auxilia a Igreja em sua missão de manter um diálogo constante com a sociedade moderna. Nossa missão envolve o gerenciamento das redes sociais, fotografia das missas e a ponte entre a paróquia e a comunidade. É necessário ter disposição para aprender e se dedicar às ferramentas tecnológicas em favor da evangelização. As reuniões ocorrem mensalmente ou conforme a necessidade dos eventos paroquiais.',
    corCamiseta: '#10B981', 
    nomeCor: 'Verde Bandeira',
    imagem: { uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500' },
    imagemLista: { uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150' },
  },
 {
    id: '4',
    nome: 'MESCE',
    descricao: 'Os Ministros Extraordinários da Sagrada Comunhão expressam o cuidado pastoral e o zelo da Igreja pelos enfermos, auxiliando o Padre na distribuição da Eucaristia. Nossa missão é levar o corpo de Cristo aos doentes em suas casas, distribuir a comunhão nas missas e presidir celebrações da palavra quando necessário. Os membros são escolhidos pelo Pároco e devem realizar um curso de formação inicial e anual. As reuniões fixas ocorrem na segunda sexta-feira de cada mês.',
    corCamiseta: '#94A3B8', 
    nomeCor: 'Branca',
    imagem: { uri: 'https://picsum.photos/id/65/600/400' },
    imagemLista: { uri: 'https://picsum.photos/id/65/150/150' },
  },
  {
    id: '5',
    nome: 'Pastoral Familiar',
    setor: 'Setor Vida e Família',
    descricao: 'Este é um serviço de apoio à Família para que viva dignamente e estabeleça relacionamentos fundados em valores evangélicos. A missão é transformar cada lar em uma Igreja doméstica missionária e santuário da vida. Atuamos no acolhimento de casais, preparação para o matrimônio e apoio no papel educador dos pais. Os interessados devem comparecer às reuniões quinzenais que acontecem às quartas-feiras, a partir das 20:00, para formação e planejamento de ações sociais.',
    corCamiseta: '#8B5CF6', 
    nomeCor: 'Roxa',
    imagem: { uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=500' },
    imagemLista: { uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=150' },
  },
  {
    id: '6',
    nome: 'ECC',
    setor: 'Setor Vida e Família',
    descricao: 'O Encontro de Casais com Cristo é um serviço da Igreja para evangelizar a família em três etapas distintas, focando no relacionamento conjugal e na fé batismal. A primeira etapa foca no chamamento, a segunda na reflexão sobre documentos da Igreja e a terceira na dignidade humana e justiça social. Para participar, o casal deve realizar o encontro anual oferecido pela paróquia. Nossos encontros comunitários ocorrem nas missas do segundo sábado de cada mês, às 18:00, com todos os casais.',
    corCamiseta: '#F59E0B', 
    nomeCor: 'Laranja',
    imagem: { uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=500' },
    imagemLista: { uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=150' },
  }
];
// ==================== CONTATOS DA PARÓQUIA ====================
const CONTATOS = [
  {
    id: '1',
    tipo: 'Instagram',
    valor: 'https://www.instagram.com/paroquiamaria/', 
    label: '@Paróquia Maria imaculada',
    icone: 'instagram',
    cor: '#E1306C',
  },
];

// ==================== NOTIFICAÇÃO DO TOPO (AUTO-HIDE) ====================
function NotificacaoTopo({ visivel, setVisivel, navigation }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visivel) {
      Animated.spring(slideAnim, { 
        toValue: Platform.OS === 'ios' ? 50 : 20, 
        useNativeDriver: true 
      }).start();
      
      const timer = setTimeout(() => {
        esconder();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [visivel]);

  const esconder = () => {
    Animated.timing(slideAnim, { 
      toValue: -120, 
      duration: 300, 
      useNativeDriver: true 
    }).start(() => setVisivel(false));
  };

  if (!visivel) return null;

  return (
    <Animated.View style={[styles.notificacaoBox, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity 
        style={styles.notificacaoContent} 
        onPress={() => { navigation.navigate('Campanhas'); esconder(); }}
      >
        <View style={styles.notificacaoIcon}>
          <MaterialCommunityIcons name="gift" size={20} color="#FFF" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.notificacaoTitulo}>Ação Social</Text>
          <Text style={styles.notificacaoTexto}>Venha ajudar na nossa campanha de doação!</Text>
        </View>
        <TouchableOpacity onPress={esconder} style={{ padding: 5 }}>
          <MaterialCommunityIcons name="close" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ==================== COMPONENTE DE EDIÇÃO SIMPLES ====================
function ModalEdicao({ visivel, fechar, titulo, valorAtual, onSalvar }) {
  const [texto, setTexto] = useState(valorAtual);
  useEffect(() => { setTexto(valorAtual); }, [valorAtual, visivel]);

  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitulo}>Editar {titulo}</Text>
          <TextInput style={styles.modalInput} value={texto} onChangeText={setTexto} multiline />
          <View style={styles.modalBotoes}>
            <TouchableOpacity style={styles.modalBtnCancelar} onPress={fechar}><Text style={styles.modalBtnTextCancelar}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSalvar} onPress={() => onSalvar(texto)}><Text style={styles.modalBtnTextSalvar}>Salvar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ==================== TELA RECUPERAR SENHA ====================
function TelaRecuperarSenha({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRecuperar = () => {
    if (!email) return Alert.alert('Aviso', 'Por favor, digite o seu e-mail.');
    
    sendPasswordResetEmail(auth, email.trim())
      .then(() => {
        Alert.alert('Sucesso', 'O link de recuperação foi enviado para o seu e-mail!');
        // Se estiver logado, volta para configurações, senão volta para o login
        if (auth.currentUser) {
          navigation.navigate('Configuracoes');
        } else {
          navigation.goBack();
        }
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível enviar o link. Verifique o e-mail digitado ou tente mais tarde.');
      });
  };

  const handleVoltar = () => {
    // LÓGICA CORRIGIDA AQUI: Verifica se tem usuário logado
    if (auth.currentUser) {
      navigation.navigate('Configuracoes');
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.containerAuth}>
      <ScrollView contentContainerStyle={styles.scrollContentAuth}>
        <View style={styles.cardAuth}>
          
          {/* BOTÃO DE VOLTAR INTELIGENTE */}
          <TouchableOpacity onPress={handleVoltar} style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          
          <View style={styles.iconContainerAuth}>
            <View style={[styles.iconCircleAuth, { backgroundColor: '#F59E0B' }]}>
              <MaterialCommunityIcons name="lock-reset" size={50} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.tituloAuth}>Recuperar Senha</Text>
          <Text style={styles.subtituloAuth}>Enviaremos um link para o seu e-mail para criar uma nova senha.</Text>
          
          <View style={styles.inputGroupAuth}>
            <Text style={styles.labelAuth}>E-mail de Cadastro</Text>
            <View style={styles.inputContainerAuth}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" style={styles.inputIconAuth} />
              <TextInput 
                style={styles.inputAuth} 
                placeholder="exemplo@email.com" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address"
              />
            </View>
          </View>
          
          <TouchableOpacity style={[styles.botaoEntrarAuth, { backgroundColor: '#F59E0B' }]} onPress={handleRecuperar}>
            <Text style={styles.botaoEntrarTextAuth}>Enviar Link</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function TelaLogin({ navigation, onLogar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleEntrar = async () => {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha tudo!');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const docSnap = await getDoc(doc(db, "usuarios", userCredential.user.uid));
      if (docSnap.exists()) onLogar(userCredential.user, docSnap.data());
    } catch (error) { Alert.alert('Erro', 'E-mail ou senha incorretos.'); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.containerAuth}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContentAuth}>
        <View style={styles.cardAuth}>
          <View style={styles.iconContainerAuth}><View style={[styles.iconCircleAuth, {backgroundColor: '#1E3A8A'}]}><MaterialCommunityIcons name="church" size={50} color="#FFFFFF" /></View></View>
          <Text style={styles.tituloAuth}>Paróquia Maria Imaculada</Text>
          <Text style={styles.subtituloAuth}>Bem-vindo(a) de volta!</Text>
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>E-mail</Text><View style={styles.inputContainerAuth}><MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" style={styles.inputIconAuth} /><TextInput style={styles.inputAuth} placeholder="Seu e-mail" value={email} onChangeText={setEmail} autoCapitalize="none" /></View></View>
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>Senha</Text><View style={styles.inputContainerAuth}><MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIconAuth} /><TextInput style={styles.inputAuth} placeholder="Sua senha" value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha} /><TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIconAuth}><MaterialCommunityIcons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" /></TouchableOpacity></View></View>
          <TouchableOpacity style={[styles.botaoEntrarAuth, {backgroundColor: '#1E3A8A'}]} onPress={handleEntrar}><Text style={styles.botaoEntrarTextAuth}>Entrar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Recuperar')} style={{ marginTop: 15 }}><Text style={[styles.linkEsqueciTextAuth, {color: '#1E3A8A'}]}>Esqueceu a senha?</Text></TouchableOpacity>
          <View style={styles.cadastroContainerAuth}><Text style={styles.cadastroTextAuth}>Ainda não tem conta? </Text><TouchableOpacity onPress={() => navigation.navigate('Cadastro')}><Text style={[styles.cadastroLinkAuth, {color: '#1E3A8A'}]}>Cadastre-se</Text></TouchableOpacity></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // PARTE 3 — Picker
  const [pastoralEscolhida, setPastoralEscolhida] = useState('');
  const [diaDisponivel, setDiaDisponivel] = useState('');

  // PARTE 3 — Slider
  const [anosParoquia, setAnosParoquia] = useState(0);
  const [distanciaCasa, setDistanciaCasa] = useState(0);

  // PARTE 3 — Switch
  const [receberAvisos, setReceberAvisos] = useState(false);
  const [voluntario, setVoluntario] = useState(false);

  const handleCadastrar = async () => {
    if (senha !== confirmaSenha) return Alert.alert('Erro', 'As senhas não batem!');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const role = email.toLowerCase().includes('admin') ? 'Admin' : 'Fiel';
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nome,
        email: email.toLowerCase(),
        tipo: role,
        pastoralEscolhida,
        diaDisponivel,
        anosParoquia,
        distanciaCasa,
        receberAvisos,
        voluntario,
      });
      Alert.alert('Sucesso', 'Conta criada!');
      navigation.goBack();
    } catch (error) { Alert.alert('Erro', 'Erro ao cadastrar. Verifique os dados.'); }
  };

  const handleLimpar = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmaSenha('');
    setPastoralEscolhida('');
    setDiaDisponivel('');
    setAnosParoquia(0);
    setDistanciaCasa(0);
    setReceberAvisos(false);
    setVoluntario(false);
    Alert.alert('Formulário limpo', 'Todos os campos foram resetados.');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.containerAuth}>
      <ScrollView contentContainerStyle={styles.scrollContentAuth}>
        <View style={styles.cardAuth}>
          <Text style={styles.tituloAuth}>Cadastro</Text>

          {/* 4 INPUTS DE TEXTO */}
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>Nome Completo</Text><View style={styles.inputContainerAuth}><TextInput style={styles.inputAuth} value={nome} onChangeText={setNome} placeholder="Seu nome completo" /></View></View>
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>E-mail</Text><View style={styles.inputContainerAuth}><TextInput style={styles.inputAuth} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="seu@email.com" /></View></View>
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>Senha</Text><View style={styles.inputContainerAuth}><TextInput style={styles.inputAuth} value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha} placeholder="Mínimo 6 caracteres" /><TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIconAuth}><MaterialCommunityIcons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" /></TouchableOpacity></View></View>
          <View style={styles.inputGroupAuth}><Text style={styles.labelAuth}>Confirmar Senha</Text><View style={styles.inputContainerAuth}><TextInput style={styles.inputAuth} value={confirmaSenha} onChangeText={setConfirmaSenha} secureTextEntry={!mostrarSenha} placeholder="Repita sua senha" /></View></View>

          {/* 2 PICKERS */}
          <View style={styles.inputGroupAuth}>
            <Text style={styles.labelAuth}>Pastoral que participa</Text>
            <View style={{ borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#F9FAFB', overflow: 'hidden' }}>
              <Picker selectedValue={pastoralEscolhida} onValueChange={setPastoralEscolhida}>
                <Picker.Item label="Selecione uma pastoral..." value="" />
                <Picker.Item label="Pastoral da Criança" value="crianca" />
                <Picker.Item label="Pastoral da Saúde" value="saude" />
                <Picker.Item label="Pastoral da Família" value="familia" />
                <Picker.Item label="Pastoral da Juventude" value="juventude" />
                <Picker.Item label="Pastoral Carcerária" value="carceraria" />
                <Picker.Item label="Pastoral da Comunicação" value="comunicacao" />
                <Picker.Item label="Nenhuma" value="nenhuma" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroupAuth}>
            <Text style={styles.labelAuth}>Dia disponível para reuniões</Text>
            <View style={{ borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#F9FAFB', overflow: 'hidden' }}>
              <Picker selectedValue={diaDisponivel} onValueChange={setDiaDisponivel}>
                <Picker.Item label="Selecione um dia..." value="" />
                <Picker.Item label="Segunda-feira" value="segunda" />
                <Picker.Item label="Terça-feira" value="terca" />
                <Picker.Item label="Quarta-feira" value="quarta" />
                <Picker.Item label="Quinta-feira" value="quinta" />
                <Picker.Item label="Sexta-feira" value="sexta" />
                <Picker.Item label="Sábado" value="sabado" />
                <Picker.Item label="Domingo" value="domingo" />
              </Picker>
            </View>
          </View>

          {/* 2 SLIDERS */}
          <View style={styles.inputGroupAuth}>
            <Text style={styles.labelAuth}>Há quantos anos frequenta a paróquia: <Text style={{ color: '#1E3A8A', fontWeight: 'bold' }}>{Math.round(anosParoquia)} ano(s)</Text></Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={50}
              step={1}
              value={anosParoquia}
              onValueChange={setAnosParoquia}
              minimumTrackTintColor="#1E3A8A"
              maximumTrackTintColor="#E2E8F0"
              thumbTintColor="#1E3A8A"
            />
          </View>

          <View style={styles.inputGroupAuth}>
            <Text style={styles.labelAuth}>Distância de casa até a paróquia: <Text style={{ color: '#1E3A8A', fontWeight: 'bold' }}>{Math.round(distanciaCasa)} km</Text></Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={distanciaCasa}
              onValueChange={setDistanciaCasa}
              minimumTrackTintColor="#1E3A8A"
              maximumTrackTintColor="#E2E8F0"
              thumbTintColor="#1E3A8A"
            />
          </View>

          {/* 2 SWITCHES */}
          <View style={[styles.inputGroupAuth, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.labelAuth}>Receber avisos da paróquia?</Text>
            <Switch
              value={receberAvisos}
              onValueChange={setReceberAvisos}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={receberAvisos ? '#1E3A8A' : '#FFF'}
            />
          </View>

          <View style={[styles.inputGroupAuth, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.labelAuth}>Deseja ser voluntário?</Text>
            <Switch
              value={voluntario}
              onValueChange={setVoluntario}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={voluntario ? '#1E3A8A' : '#FFF'}
            />
          </View>

          {/* 2 BOTÕES COM INTERAÇÃO */}
          <TouchableOpacity style={[styles.botaoEntrarAuth, { backgroundColor: '#1E3A8A', marginBottom: 12 }]} onPress={handleCadastrar}>
            <Text style={styles.botaoEntrarTextAuth}>Criar Minha Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botaoEntrarAuth, { backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: '#CBD5E1' }]} onPress={handleLimpar}>
            <Text style={[styles.botaoEntrarTextAuth, { color: '#64748B' }]}>Limpar Formulário</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={[styles.cadastroLinkAuth, { textAlign: 'center', color: '#1E3A8A' }]}>Já tenho conta / Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==================== TELA MISSAS ====================
function TelaMissas({ navigation, dadosAdmin, infoBanco, atualizarListas }) {
  const [modalMissa, setModalMissa] = useState(false);
  const [nomeMissa, setNomeMissa] = useState('');
  const [horarioMissa, setHorarioMissa] = useState('');
  
  const hojeStr = DIAS_SEMANA[new Date().getDay()];
  const [diaMissa, setDiaMissa] = useState(hojeStr);

  const lista = infoBanco.listaMissas || [];

  const handleSalvarMissa = () => {
    if (!nomeMissa || !horarioMissa) return Alert.alert("Erro", "Preencha o nome e o horário.");
    const novaMissa = { id: Date.now().toString(), nome: nomeMissa, horario: horarioMissa, diaDaSemana: diaMissa };
    atualizarListas('listaMissas', [...lista, novaMissa]);
    setModalMissa(false);
    setNomeMissa('');
    setHorarioMissa('');
  };

  const handleRemoverMissa = (id) => {
    Alert.alert("Remover", "Deseja excluir este horário?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim, Excluir", style: "destructive", onPress: () => atualizarListas('listaMissas', lista.filter(item => item.id !== id)) }
    ]);
  };

  const diasOrdenados = [hojeStr, ...DIAS_SEMANA.filter(dia => dia !== hojeStr)];

  return (
    <SafeAreaView style={styles.containerHome}>
      <View style={[styles.blueHeader, { paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}><MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Horários das Missas</Text>
      </View>
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 5}}>
          <Text style={[styles.secaoTitulo, {marginTop: 0, marginBottom: 0}]}>Programação por Dia</Text>
        </View>

        {diasOrdenados.map((dia) => {
          const missasDesteDia = lista.filter(missa => missa.diaDaSemana === dia);
          if (dia !== hojeStr && missasDesteDia.length === 0) return null;

          return (
            <View key={dia} style={{ marginTop: 20 }}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1E3A8A'}}>{dia}</Text>
                {dia === hojeStr && (
                  <View style={{backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 10}}>
                    <Text style={{color: '#FFF', fontSize: 12, fontWeight: 'bold'}}>HOJE</Text>
                  </View>
                )}
              </View>
              {missasDesteDia.length === 0 ? (
                <Text style={{color: '#64748B', fontStyle: 'italic', marginBottom: 10}}>Nenhuma missa programada para hoje.</Text>
              ) : (
                missasDesteDia.map((missa) => (
                  <View key={missa.id} style={styles.cardItemOrganizado}>
                    <View style={[styles.cardIconCircle, { backgroundColor: '#DBEAFE' }]}>
                      <MaterialCommunityIcons name="clock-outline" size={26} color="#1E40AF" />
                    </View>
                    <View style={{flex: 1, marginLeft: 15}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1E293B'}}>{missa.nome}</Text>
                      <Text style={{fontSize: 14, color: '#64748B', marginTop: 2}}>{missa.horario}</Text>
                    </View>
                    {dadosAdmin?.tipo === 'Admin' && (
                      <TouchableOpacity onPress={() => handleRemoverMissa(missa.id)} style={{padding: 10}}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          );
        })}

        {dadosAdmin?.tipo === 'Admin' && (
          <TouchableOpacity onPress={() => setModalMissa(true)} style={styles.btnAdicionarNovo}>
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 5}}>Adicionar Horário</Text>
          </TouchableOpacity>
        )}
        <View style={{height: 40}}/>
      </ScrollView>

      <Modal visible={modalMissa} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Novo Horário de Missa</Text>
            <Text style={styles.labelAuth}>Qual é o dia da semana?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
              {DIAS_SEMANA.map(dia => (
                <TouchableOpacity key={dia} onPress={() => setDiaMissa(dia)} style={{backgroundColor: diaMissa === dia ? '#1E40AF' : '#E2E8F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8}}>
                  <Text style={{color: diaMissa === dia ? '#FFF' : '#475569', fontWeight: 'bold'}}>{dia}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.labelAuth}>Qual é a missa? (Ex: Missa das Crianças)</Text>
            <TextInput style={[styles.inputSimples, {backgroundColor: '#F8FAFC'}]} value={nomeMissa} onChangeText={setNomeMissa} />
            <Text style={styles.labelAuth}>Horário e Local (Ex: 19h00 na Matriz)</Text>
            <TextInput style={[styles.inputSimples, {backgroundColor: '#F8FAFC'}]} value={horarioMissa} onChangeText={setHorarioMissa} />
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => setModalMissa(false)}><Text style={styles.modalBtnTextCancelar}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSalvar} onPress={handleSalvarMissa}><Text style={styles.modalBtnTextSalvar}>Adicionar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==================== TELA CONFISSÕES ====================
function TelaConfissoes({ navigation, dadosAdmin, infoBanco, atualizarListas }) {
  const [modalConf, setModalConf] = useState(false);
  const [nomeConf, setNomeConf] = useState('');
  const [horarioConf, setHorarioConf] = useState('');
  
  const hojeStr = DIAS_SEMANA[new Date().getDay()];
  const [diaConf, setDiaConf] = useState(hojeStr);

  const lista = infoBanco.listaConfissoes || [];

  const handleSalvarConfissao = () => {
    if (!nomeConf || !horarioConf) return Alert.alert("Erro", "Preencha o nome e o horário.");
    const novaConfissao = { id: Date.now().toString(), nome: nomeConf, horario: horarioConf, diaDaSemana: diaConf };
    atualizarListas('listaConfissoes', [...lista, novaConfissao]);
    setModalConf(false);
    setNomeConf('');
    setHorarioConf('');
  };

  const handleRemoverConfissao = (id) => {
    Alert.alert("Remover", "Deseja excluir este horário?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim, Excluir", style: "destructive", onPress: () => atualizarListas('listaConfissoes', lista.filter(item => item.id !== id)) }
    ]);
  };

  const diasOrdenados = [hojeStr, ...DIAS_SEMANA.filter(dia => dia !== hojeStr)];

  return (
    <SafeAreaView style={styles.containerHome}>
      <View style={[styles.blueHeader, { paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}><MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Horários de Confissões</Text>
      </View>
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 5}}>
          <Text style={[styles.secaoTitulo, {marginTop: 0, marginBottom: 0}]}>Programação por Dia</Text>
        </View>

        {diasOrdenados.map((dia) => {
          const confissoesDesteDia = lista.filter(conf => conf.diaDaSemana === dia);
          if (dia !== hojeStr && confissoesDesteDia.length === 0) return null;

          return (
            <View key={dia} style={{ marginTop: 20 }}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1E3A8A'}}>{dia}</Text>
                {dia === hojeStr && (
                  <View style={{backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 10}}>
                    <Text style={{color: '#FFF', fontSize: 12, fontWeight: 'bold'}}>HOJE</Text>
                  </View>
                )}
              </View>
              {confissoesDesteDia.length === 0 ? (
                <Text style={{color: '#64748B', fontStyle: 'italic', marginBottom: 10}}>Nenhum horário programado para hoje.</Text>
              ) : (
                confissoesDesteDia.map((conf) => (
                  <View key={conf.id} style={styles.cardItemOrganizado}>
                    <View style={[styles.cardIconCircle, { backgroundColor: '#EDE9FE' }]}>
                      <MaterialCommunityIcons name="book-cross" size={26} color="#6D28D9" />
                    </View>
                    <View style={{flex: 1, marginLeft: 15}}>
                      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1E293B'}}>{conf.nome}</Text>
                      <Text style={{fontSize: 14, color: '#64748B', marginTop: 2}}>{conf.horario}</Text>
                    </View>
                    {dadosAdmin?.tipo === 'Admin' && (
                      <TouchableOpacity onPress={() => handleRemoverConfissao(conf.id)} style={{padding: 10}}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          );
        })}

        {dadosAdmin?.tipo === 'Admin' && (
          <TouchableOpacity onPress={() => setModalConf(true)} style={[styles.btnAdicionarNovo, {backgroundColor: '#6D28D9'}]}>
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 5}}>Adicionar Horário</Text>
          </TouchableOpacity>
        )}
        <View style={{height: 40}}/>
      </ScrollView>

      <Modal visible={modalConf} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Novo Horário de Confissão</Text>
            <Text style={styles.labelAuth}>Qual é o dia da semana?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
              {DIAS_SEMANA.map(dia => (
                <TouchableOpacity key={dia} onPress={() => setDiaConf(dia)} style={{backgroundColor: diaConf === dia ? '#6D28D9' : '#E2E8F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8}}>
                  <Text style={{color: diaConf === dia ? '#FFF' : '#475569', fontWeight: 'bold'}}>{dia}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.labelAuth}>Padre/Local (Ex: Pe. João - Matriz)</Text>
            <TextInput style={[styles.inputSimples, {backgroundColor: '#F8FAFC'}]} value={nomeConf} onChangeText={setNomeConf} />
            <Text style={styles.labelAuth}>Horário (Ex: das 15h às 17h)</Text>
            <TextInput style={[styles.inputSimples, {backgroundColor: '#F8FAFC'}]} value={horarioConf} onChangeText={setHorarioConf} />
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => setModalConf(false)}><Text style={styles.modalBtnTextCancelar}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnSalvar, {backgroundColor: '#6D28D9'}]} onPress={handleSalvarConfissao}><Text style={styles.modalBtnTextSalvar}>Adicionar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TelaCampanhas({ navigation, dadosAdmin, infoBanco, atualizarListas }) {
  const [modalItem, setModalItem] = useState(false);
  const [modalBaixa, setModalBaixa] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [novaQtd, setNovaQtd] = useState('');
  
  const [nomeItem, setNomeItem] = useState('');
  const [metaItem, setMetaItem] = useState('');

  const lista = infoBanco.listaDoacoes || [];

  // Filtra para o FIEL ver apenas o que ainda falta (onde atual < meta)
  const itensFaltando = lista.filter(item => (item.atual || 0) < (item.meta || 0));

  const handleSalvarItem = () => {
    if (!nomeItem || !metaItem) return Alert.alert("Erro", "Preencha o nome e a meta.");
    const novoItem = { id: Date.now().toString(), nome: nomeItem, meta: parseInt(metaItem, 10), atual: 0 };
    atualizarListas('listaDoacoes', [...lista, novoItem]);
    setModalItem(false); setNomeItem(''); setMetaItem('');
  };

  const confirmarBaixa = () => {
    const valor = parseInt(novaQtd, 10);
    if (isNaN(valor)) return Alert.alert("Erro", "Digite um número válido.");
    
    const novaLista = lista.map(i => i.id === itemSelecionado.id ? { ...i, atual: valor } : i);
    atualizarListas('listaDoacoes', novaLista);
    
    if (valor >= itemSelecionado.meta) {
      Alert.alert("🎉 Meta Batida!", `A meta para ${itemSelecionado.nome} foi alcançada!`);
    }
    setModalBaixa(false); setNovaQtd('');
  };

  return (
    <SafeAreaView style={styles.containerHome}>
      <View style={[styles.blueHeader, { backgroundColor: '#10B981', paddingBottom: 20, flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}><MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Campanha da Alimentação</Text>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.cardAlimentos, { marginTop: 20 }]}>
          <View style={styles.alimentosHeader}>
            <MaterialCommunityIcons name="basket" size={28} color="#FFF" />
            <Text style={styles.alimentosTitulo}>Cesta Básica</Text>
          </View>

          {/* VISÃO DO FIEL (Não vê números, só o que falta) */}
          {dadosAdmin?.tipo !== 'Admin' ? (
            <View style={{ marginTop: 15 }}>
              <Text style={{ color: '#FFF', fontSize: 16, marginBottom: 10, fontWeight: 'bold' }}>Itens que estamos precisando:</Text>
              {itensFaltando.length === 0 ? (
                <Text style={{ color: '#FFF', textAlign: 'center', padding: 20 }}>No momento todas as nossas metas foram batidas! Graças a Deus!</Text>
              ) : (
                itensFaltando.map(item => (
                  <View key={item.id} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>{item.nome}</Text>
                    <TouchableOpacity 
                      onPress={() => Alert.alert("Como Doar?", "Receberemos sua doação na igreja. Fale com alguns dos nossos vigias que estão sempre na guarita.")}
                      style={{ backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}
                    >
                      <Text style={{ color: '#1D4ED8', fontWeight: 'bold', fontSize: 12 }}>QUERO DOAR</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          ) : (
            /* VISÃO DO ADMIN (Controle Total) */
            <View style={{ marginTop: 15 }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 10 }}>Gerenciamento de Estoque (Admin):</Text>
              {lista.map(item => (
                <View key={item.id} style={{ backgroundColor: '#1D4ED8', padding: 12, borderRadius: 10, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{item.nome}</Text>
                  <Text style={{ color: '#DBEAFE', fontSize: 12 }}>Tem: {item.atual} | Meta: {item.meta}</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { setItemSelecionado(item); setNovaQtd(item.atual.toString()); setModalBaixa(true); }} style={{ backgroundColor: '#10B981', padding: 8, borderRadius: 5, flex: 1, alignItems: 'center' }}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>DAR BAIXA / ATUALIZAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => atualizarListas('listaDoacoes', lista.filter(i => i.id !== item.id))} style={{ backgroundColor: '#EF4444', padding: 8, borderRadius: 5 }}>
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity onPress={() => setModalItem(true)} style={[styles.btnAdicionarNovo, { backgroundColor: '#047857', marginTop: 15 }]}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+ CADASTRAR NOVO ITEM</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* MODAL PARA DAR BAIXA (ADMIN) */}
      <Modal visible={modalBaixa} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Atualizar: {itemSelecionado?.nome}</Text>
            <Text style={{ marginBottom: 10, color: '#64748B' }}>Digite a quantidade total que a paróquia tem agora no estoque:</Text>
            <TextInput 
              style={styles.inputSimples} 
              value={novaQtd} 
              onChangeText={setNovaQtd} 
              keyboardType="numeric" 
              placeholder="Ex: 20"
              autoFocus
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => setModalBaixa(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSalvar} onPress={confirmarBaixa}><Text style={{ color: '#FFF' }}>Salvar Estoque</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA CADASTRAR ITEM (ADMIN) - Igual ao anterior mas corrigido */}
      <Modal visible={modalItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Cadastrar Item na Campanha</Text>
            <TextInput style={styles.inputSimples} placeholder="Nome do Alimento" value={nomeItem} onChangeText={setNomeItem} />
            <TextInput style={styles.inputSimples} placeholder="Meta de Arrecadação" value={metaItem} onChangeText={setMetaItem} keyboardType="numeric" />
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => setModalItem(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSalvar} onPress={handleSalvarItem}><Text style={{ color: '#FFF' }}>Cadastrar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
// ==================== [NOVO] TELA PASTORAIS ====================
// PARTE 1: lista com imagem | PARTE 2: detalhe com imagem + descrição 30+ palavras
function TelaPastorais({ navigation }) {
  const [pastoralSelecionada, setPastoralSelecionada] = useState(null);

  return (
    <SafeAreaView style={styles.containerHome}>
      <View style={[styles.blueHeader, { backgroundColor: '#7C3AED', paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Pastorais</Text>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.secaoTitulo, { marginTop: 20 }]}>Nossas Pastorais</Text>
        <Text style={{ color: '#64748B', marginBottom: 15, fontSize: 14, lineHeight: 20 }}>
          Conheça os grupos de serviço e evangelização da nossa paróquia. Toque em uma pastoral para saber mais.
        </Text>

        {/* PARTE 1: lista com imagem real */}
        {PASTORAIS_DATA.map((pastoral) => (
          <TouchableOpacity
            key={pastoral.id}
            style={styles.cardItemOrganizado}
            onPress={() => setPastoralSelecionada(pastoral)}
          >
            {/* Imagem real usando <Image> */}
            <Image
              source={pastoral.imagemLista}
              style={{ width: 55, height: 55, borderRadius: 18, backgroundColor: pastoral.corCamiseta + '33' }}
              defaultSource={require('./assets/icon.png')}
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>{pastoral.nome}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: pastoral.corCamiseta, marginRight: 6 }} />
                <Text style={{ fontSize: 13, color: '#64748B' }}>Camiseta {pastoral.nomeCor}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* PARTE 2: tela de detalhe com imagem + descrição 30+ palavras */}
      <Modal visible={!!pastoralSelecionada} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { maxWidth: '92%', maxHeight: '85%' }]}>
            {pastoralSelecionada && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Imagem grande no detalhe */}
                <Image
                  source={pastoralSelecionada.imagem}
                  style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 15, backgroundColor: pastoralSelecionada.corCamiseta + '33' }}
                  resizeMode="cover"
                />

                <Text style={[styles.modalTitulo, { textAlign: 'center', marginBottom: 8 }]}>
                  {pastoralSelecionada.nome}
                </Text>

                {/* Descrição com 30+ palavras - Parte 2 */}
                <Text style={{ color: '#475569', fontSize: 15, lineHeight: 24, marginBottom: 18, textAlign: 'justify' }}>
                  {pastoralSelecionada.descricao}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 20 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: pastoralSelecionada.corCamiseta, marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>CAMISETA DE IDENTIFICAÇÃO</Text>
                    <Text style={{ fontSize: 15, color: '#1E293B', fontWeight: 'bold' }}>{pastoralSelecionada.nomeCor}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.modalBtnSalvar, { alignSelf: 'center', paddingHorizontal: 40 }]}
                  onPress={() => setPastoralSelecionada(null)}
                >
                  <Text style={styles.modalBtnTextSalvar}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==================== TELA CONTATO ====================
function TelaContato({ navigation }) {
  
  const NUMERO_LIGACAO = "613974-6600";
  const NUMERO_WHATSAPP = "613974-6600"; 
  const LINK_YOUTUBE = "https://www.youtube.com/paroquiamariaimaculada" 
  const ENDERECO_EMAIL = "paroquiaimaculadaguara@gmail.com"; 
  // ----------------------------------------------------

  const abrirLigacao = () => Linking.openURL(`tel:${NUMERO_LIGACAO}`);
  const abrirWhatsApp = () => Linking.openURL(`https://wa.me/${NUMERO_WHATSAPP}`);
  const abrirYouTube = () => Linking.openURL(LINK_YOUTUBE);
  const abrirEmail = () => Linking.openURL(`mailto:${ENDERECO_EMAIL}`);

  return (
    <SafeAreaView style={styles.containerHome}>
      <View style={[styles.blueHeader, { backgroundColor: '#1E3A8A', paddingBottom: 20, flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Nossos Contatos</Text>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 16, color: '#475569', marginBottom: 25, textAlign: 'center' }}>
            Fale conosco através de um dos nossos canais de atendimento ou acompanhe nossas redes.
          </Text>

          {/* BOTÃO - LIGAÇÃO */}
          <TouchableOpacity onPress={abrirLigacao} style={{ backgroundColor: '#DBEAFE', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ backgroundColor: '#1D4ED8', padding: 10, borderRadius: 10, marginRight: 15 }}>
              <MaterialCommunityIcons name="phone" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' }}>Ligar para a Secretaria</Text>
              <Text style={{ color: '#64748B' }}>Fale diretamente conosco</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
          </TouchableOpacity>

          {/* BOTÃO - WHATSAPP */}
          <TouchableOpacity onPress={abrirWhatsApp} style={{ backgroundColor: '#DCFCE7', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ backgroundColor: '#16A34A', padding: 10, borderRadius: 10, marginRight: 15 }}>
              <MaterialCommunityIcons name="whatsapp" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534' }}>WhatsApp</Text>
              <Text style={{ color: '#64748B' }}>Mande uma mensagem</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
          </TouchableOpacity>

          {/* BOTÃO - YOUTUBE */}
          <TouchableOpacity onPress={abrirYouTube} style={{ backgroundColor: '#FEE2E2', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ backgroundColor: '#DC2626', padding: 10, borderRadius: 10, marginRight: 15 }}>
              <MaterialCommunityIcons name="youtube" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#991B1B' }}>Canal no YouTube</Text>
              <Text style={{ color: '#64748B' }}>Acompanhe nossas missas e vídeos</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
          </TouchableOpacity>

          {/* BOTÃO - E-MAIL (GMAIL) */}
          <TouchableOpacity onPress={abrirEmail} style={{ backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ backgroundColor: '#4B5563', padding: 10, borderRadius: 10, marginRight: 15 }}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>Enviar E-mail</Text>
              <Text style={{ color: '#64748B' }}>Dúvidas ou solicitações</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#94A3B8" />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// ==================== [NOVO] TELA CONFIGURAÇÕES ====================
function TelaConfiguracoes({ navigation, perfil, onSair, temaDark, setTemaDark }) {
  const [modalExcluir, setModalExcluir] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState(false);
  const [senhaExcluir, setSenhaExcluir] = useState('');

  const handleExcluirConta = async () => {
    if (!confirmarExcluir) return Alert.alert('Atenção', 'Marque a caixa de confirmação para continuar.');
    if (!senhaExcluir) return Alert.alert('Erro', 'Digite sua senha para confirmar.');

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, senhaExcluir);
      // Reautentica o usuário antes de excluir
      const { EmailAuthProvider: EAP, reauthenticateWithCredential: reauth } = await import('firebase/auth');
      const { EmailAuthProvider: EP } = require('firebase/auth');
      
      // Apaga do Firestore
      await deleteDoc(doc(db, "usuarios", user.uid));
      // Apaga da Auth
      await deleteUser(user);

      setModalExcluir(false);
      Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
      onSair();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a conta. Verifique sua senha e tente novamente.');
    }
  };

  const corFundo = temaDark ? '#0F172A' : '#F8FAFC';
  const corCard = temaDark ? '#1E293B' : '#FFFFFF';
  const corTexto = temaDark ? '#F1F5F9' : '#1E293B';
  const corSubTexto = temaDark ? '#94A3B8' : '#64748B';

  return (
    <SafeAreaView style={[styles.containerHome, { backgroundColor: corFundo }]}>
      <View style={[styles.blueHeader, { paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.nomeUsuarioHome}>Configurações</Text>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>

        {/* PERFIL */}
        <Text style={[styles.secaoTitulo, { marginTop: 20, color: corTexto }]}>Minha Conta</Text>
        <View style={[styles.cardItemOrganizado, { backgroundColor: corCard, flexDirection: 'column', alignItems: 'flex-start', padding: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <MaterialCommunityIcons name="account-circle-outline" size={30} color="#1E40AF" />
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: corTexto }}>{perfil?.nome || 'Usuário'}</Text>
              <Text style={{ fontSize: 13, color: corSubTexto }}>{perfil?.tipo || 'Fiel'}</Text>
            </View>
          </View>
          <View style={{ width: '100%', height: 1, backgroundColor: temaDark ? '#334155' : '#E2E8F0', marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="email-outline" size={18} color={corSubTexto} />
            <Text style={{ marginLeft: 8, fontSize: 14, color: corSubTexto }}>{perfil?.email || ''}</Text>
          </View>
        </View>

        {/* TROCAR SENHA */}
        <TouchableOpacity
          style={[styles.cardItemOrganizado, { backgroundColor: corCard, marginTop: 10 }]}
          onPress={() => navigation.navigate('Recuperar')}
        >
          <View style={[styles.cardIconCircle, { backgroundColor: '#FEF9C3' }]}>
            <MaterialCommunityIcons name="lock-reset" size={26} color="#CA8A04" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: corTexto }}>Trocar Senha</Text>
            <Text style={{ fontSize: 13, color: corSubTexto }}>Enviar link de redefinição por e-mail</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
        </TouchableOpacity>

        {/* TEMA */}
        <Text style={[styles.secaoTitulo, { color: corTexto }]}>Aparência</Text>
        <View style={[styles.cardItemOrganizado, { backgroundColor: corCard }]}>
          <View style={[styles.cardIconCircle, { backgroundColor: temaDark ? '#1E293B' : '#F1F5F9' }]}>
            <MaterialCommunityIcons name={temaDark ? 'weather-night' : 'white-balance-sunny'} size={26} color={temaDark ? '#818CF8' : '#F59E0B'} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: corTexto }}>Tema {temaDark ? 'Escuro' : 'Claro'}</Text>
            <Text style={{ fontSize: 13, color: corSubTexto }}>Toque para alternar o tema</Text>
          </View>
          <Switch
            value={temaDark}
            onValueChange={setTemaDark}
            trackColor={{ false: '#E2E8F0', true: '#818CF8' }}
            thumbColor={temaDark ? '#6366F1' : '#FFF'}
          />
        </View>

        {/* SAIR */}
        <Text style={[styles.secaoTitulo, { color: corTexto }]}>Conta</Text>
        <TouchableOpacity
          style={[styles.cardItemOrganizado, { backgroundColor: corCard }]}
          onPress={() => Alert.alert('Sair', 'Deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: onSair },
          ])}
        >
          <View style={[styles.cardIconCircle, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="logout" size={26} color="#EF4444" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EF4444' }}>Sair da Conta</Text>
            <Text style={{ fontSize: 13, color: corSubTexto }}>Encerrar sessão atual</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
        </TouchableOpacity>

        {/* EXCLUIR CONTA */}
        <TouchableOpacity
          style={[styles.cardItemOrganizado, { backgroundColor: corCard, marginTop: 10, marginBottom: 30 }]}
          onPress={() => { setModalExcluir(true); setConfirmarExcluir(false); setSenhaExcluir(''); }}
        >
          <View style={[styles.cardIconCircle, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="account-remove-outline" size={26} color="#DC2626" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#DC2626' }}>Excluir Conta</Text>
            <Text style={{ fontSize: 13, color: corSubTexto }}>Remove todos os seus dados permanentemente</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL EXCLUIR CONTA */}
      <Modal visible={modalExcluir} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <View style={[styles.cardIconCircle, { backgroundColor: '#FEE2E2', width: 60, height: 60, borderRadius: 18, marginBottom: 10 }]}>
                <MaterialCommunityIcons name="alert-outline" size={32} color="#DC2626" />
              </View>
              <Text style={[styles.modalTitulo, { color: '#DC2626', textAlign: 'center' }]}>Excluir Conta</Text>
            </View>

            <Text style={{ color: '#475569', fontSize: 14, lineHeight: 20, marginBottom: 15, textAlign: 'center' }}>
              Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.
            </Text>

            <Text style={[styles.labelAuth, { marginBottom: 6 }]}>Digite sua senha para confirmar:</Text>
            <TextInput
              style={[styles.inputSimples, { backgroundColor: '#F8FAFC', marginBottom: 15 }]}
              placeholder="Sua senha"
              secureTextEntry
              value={senhaExcluir}
              onChangeText={setSenhaExcluir}
            />

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
              onPress={() => setConfirmarExcluir(!confirmarExcluir)}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                borderColor: confirmarExcluir ? '#DC2626' : '#CBD5E1',
                backgroundColor: confirmarExcluir ? '#DC2626' : 'transparent',
                justifyContent: 'center', alignItems: 'center', marginRight: 10
              }}>
                {confirmarExcluir && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
              </View>
              <Text style={{ fontSize: 14, color: '#475569', flex: 1 }}>
                Entendo que esta ação é irreversível e quero excluir minha conta.
              </Text>
            </TouchableOpacity>

            <View style={styles.modalBotoes}>
              {/* === AQUI FOI FEITA A CORREÇÃO NO BOTÃO CANCELAR === */}
              <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => {
                setModalExcluir(false);
                setConfirmarExcluir(false);
                setSenhaExcluir('');
              }}>
                <Text style={styles.modalBtnTextCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalBtnSalvar, { backgroundColor: '#DC2626' }]}
                onPress={handleExcluirConta}
              >
                <Text style={styles.modalBtnTextSalvar}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==================== TELA HOME ====================
function TelaHome({ dados, onSair, navigation, infoBanco, abrirEdicao, temaDark, setTemaDark }) {
  const [mostrarPopUp, setMostrarPopUp] = useState(false);
  const hojeStr = DIAS_SEMANA[new Date().getDay()];
  
  const missasDeHoje = (infoBanco.listaMissas || []).filter(missa => missa.diaDaSemana === hojeStr);
  const confissoesDeHoje = (infoBanco.listaConfissoes || []).filter(conf => conf.diaDaSemana === hojeStr);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarPopUp(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.containerHome}>
      <StatusBar barStyle="light-content" />
      
      {/* NOTIFICAÇÃO DO TOPO */}
      <NotificacaoTopo visivel={mostrarPopUp} setVisivel={setMostrarPopUp} navigation={navigation} />

      <View style={styles.blueHeader}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.saudacaoHome}>Olá,</Text>
            <Text style={styles.nomeUsuarioHome}>{dados?.nome ? dados.nome : 'Amigo(a)'}</Text>
          </View>
          {/* [NOVO] Ícone de engrenagem no lugar do badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.badgeTipo}>
              <Text style={styles.badgeText}>{dados?.tipo || 'Fiel'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Configuracoes')} style={{ padding: 4 }}>
              <MaterialCommunityIcons name="cog-outline" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        
        {/* ORAÇÃO DO DIA */}
        <View style={styles.cardOracao}>
          <View style={styles.linhaOracao}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#92400E" />
              <Text style={styles.tituloOracao}>Oração do Dia</Text>
            </View>
            {dados?.tipo === 'Admin' && (
              <TouchableOpacity onPress={() => abrirEdicao('oracao', 'Oração do Dia', infoBanco.oracao)}>
                <MaterialCommunityIcons name="pencil-circle" size={28} color="#D97706" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.textoOracao}>{infoBanco.oracao}</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10}}>
          <Text style={[styles.secaoTitulo, {marginTop: 0, marginBottom: 0}]}>Missas de Hoje ({hojeStr})</Text>
        </View>

        {/* LISTA DE MISSAS DO DIA ATUAL */}
        {missasDeHoje.length === 0 ? (
           <View style={[styles.cardNovo, { justifyContent: 'center' }]}>
             <Text style={{color: '#64748B'}}>Nenhuma missa cadastrada para hoje.</Text>
           </View>
        ) : (
          missasDeHoje.map((missa, index) => (
            <View key={index} style={styles.cardNovo}>
              <View style={[styles.cardIconCircle, { backgroundColor: '#DBEAFE' }]}><MaterialCommunityIcons name="church" size={30} color="#1E40AF" /></View>
              <View style={styles.cardInfoContent}>
                <Text style={styles.cardTituloInterno}>{missa.nome}</Text>
                <Text style={styles.cardTextoInterno}>{missa.horario}</Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.btnVerMais} onPress={() => navigation.navigate('Missas')}>
          <Text style={styles.btnVerMaisText}>{dados?.tipo === 'Admin' ? 'Gerenciar horários de missas' : 'Ver missas de todos os dias'}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#1E40AF" />
        </TouchableOpacity>

        {/* CONFISSÕES */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10}}>
          <Text style={[styles.secaoTitulo, {marginTop: 0, marginBottom: 0}]}>Confissões de Hoje</Text>
        </View>

        {confissoesDeHoje.length === 0 ? (
           <View style={[styles.cardNovo, { justifyContent: 'center' }]}>
             <Text style={{color: '#64748B'}}>Nenhuma confissão cadastrada para hoje.</Text>
           </View>
        ) : (
          confissoesDeHoje.map((conf, index) => (
            <View key={index} style={styles.cardNovo}>
              <View style={[styles.cardIconCircle, { backgroundColor: '#EDE9FE' }]}><MaterialCommunityIcons name="book-cross" size={30} color="#6D28D9" /></View>
              <View style={styles.cardInfoContent}>
                <Text style={styles.cardTituloInterno}>{conf.nome}</Text>
                <Text style={styles.cardTextoInterno}>{conf.horario}</Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={[styles.btnVerMais, {backgroundColor: '#EDE9FE'}]} onPress={() => navigation.navigate('Confissoes')}>
          <Text style={[styles.btnVerMaisText, {color: '#6D28D9'}]}>{dados?.tipo === 'Admin' ? 'Gerenciar horários de confissões' : 'Ver confissões de todos os dias'}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6D28D9" />
        </TouchableOpacity>

        <Text style={styles.secaoTitulo}>Campanha da Alimentação</Text>

        {/* CAMPANHAS */}
        <View style={styles.cardAlimentos}>
          <View style={styles.alimentosHeader}>
            <MaterialCommunityIcons name="heart" size={28} color="#FFF" />
            <Text style={styles.alimentosTitulo}>Cesta Básica</Text>
          </View>
          <Text style={styles.alimentosDesc}>Precisamos da sua ajuda para montar as cestas básicas desta semana.</Text>
          <TouchableOpacity style={styles.btnDoarAgora} onPress={() => navigation.navigate('Campanhas')}>
            <Text style={styles.btnDoarText}>{dados?.tipo === 'Admin' ? 'GERENCIAR ITENS' : 'VER CAMPANHA E DOAR'}</Text>
          </TouchableOpacity>
        </View>

        {/* [NOVO] Botões de atalho para Pastorais e Contato */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 15 }}>
          <TouchableOpacity
            style={[styles.btnVerMais, { flex: 1, backgroundColor: '#EDE9FE' }]}
            onPress={() => navigation.navigate('Pastorais')}
          >
            <MaterialCommunityIcons name="account-group-outline" size={20} color="#7C3AED" />
            <Text style={[styles.btnVerMaisText, { color: '#7C3AED', marginLeft: 6 }]}>Pastorais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnVerMais, { flex: 1, backgroundColor: '#DCFCE7' }]}
            onPress={() => navigation.navigate('Contato')}
          >
            <MaterialCommunityIcons name="phone-outline" size={20} color="#16A34A" />
            <Text style={[styles.btnVerMaisText, { color: '#16A34A', marginLeft: 6 }]}>Contato</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== APP PRINCIPAL ====================
export default function App() {
  const [telaAtual, setTelaAtual] = useState('Login');
  const [perfil, setPerfil] = useState(null);
  const [temaDark, setTemaDark] = useState(false); // [NOVO] estado do tema
  
  const [infoBanco, setInfoBanco] = useState({});
  const [modalEdit, setModalEdit] = useState({ visivel: false, campo: '', titulo: '', valor: '' });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "igreja", "informacoes"), (docSnap) => {
      if (docSnap.exists()) {
        setInfoBanco({
          oracao: docSnap.data().oracao || "\"Senhor, fazei de mim um instrumento da vossa paz...\"",
          listaMissas: docSnap.data().listaMissas || [], 
          listaConfissoes: docSnap.data().listaConfissoes || [], 
          listaDoacoes: docSnap.data().listaDoacoes || []
        });
      }
    });
    return () => unsub();
  }, []);

  const abrirEdicao = (campo, titulo, valor) => setModalEdit({ visivel: true, campo, titulo, valor });
  const salvarEdicao = async (novoValor) => {
    try {
      await setDoc(doc(db, "igreja", "informacoes"), { [modalEdit.campo]: novoValor }, { merge: true });
      setModalEdit({ ...modalEdit, visivel: false });
    } catch (e) { Alert.alert("Erro", "Falha ao atualizar as informações."); }
  };

  const atualizarListasNoFirebase = async (campo, novaLista) => {
    try { await setDoc(doc(db, "igreja", "informacoes"), { [campo]: novaLista }, { merge: true }); } 
    catch (e) { Alert.alert("Erro", "Falha ao atualizar a lista."); }
  };

  const handleLoginSucesso = (usuario, dados) => { setPerfil(dados); setTelaAtual('Home'); };
  const handleSair = () => { setPerfil(null); setTelaAtual('Login'); };

  const navInterna = { navigate: setTelaAtual, goBack: () => setTelaAtual('Home') };
  const navAuth = { navigate: setTelaAtual, goBack: () => setTelaAtual('Login') };

  return (
    <>
      {telaAtual === 'Home' && <TelaHome dados={perfil} onSair={handleSair} navigation={navInterna} infoBanco={infoBanco} abrirEdicao={abrirEdicao} temaDark={temaDark} setTemaDark={setTemaDark} />}
      {telaAtual === 'Missas' && <TelaMissas navigation={navInterna} dadosAdmin={perfil} infoBanco={infoBanco} atualizarListas={atualizarListasNoFirebase} />}
      {telaAtual === 'Confissoes' && <TelaConfissoes navigation={navInterna} dadosAdmin={perfil} infoBanco={infoBanco} atualizarListas={atualizarListasNoFirebase} />}
      {telaAtual === 'Campanhas' && <TelaCampanhas navigation={navInterna} dadosAdmin={perfil} infoBanco={infoBanco} atualizarListas={atualizarListasNoFirebase} />}
      {/* [NOVO] Telas adicionadas */}
      {telaAtual === 'Pastorais' && <TelaPastorais navigation={navInterna} />}
      {telaAtual === 'Contato' && <TelaContato navigation={navInterna} />}
      {telaAtual === 'Configuracoes' && <TelaConfiguracoes navigation={navInterna} perfil={perfil} onSair={handleSair} temaDark={temaDark} setTemaDark={setTemaDark} />}
      {telaAtual === 'Cadastro' && <TelaCadastro navigation={navAuth} />}
      {telaAtual === 'Recuperar' && <TelaRecuperarSenha navigation={navAuth} />}
      {telaAtual === 'Login' && <TelaLogin navigation={navAuth} onLogar={handleLoginSucesso} />}
      
      <ModalEdicao visivel={modalEdit.visivel} fechar={() => setModalEdit({...modalEdit, visivel: false})} titulo={modalEdit.titulo} valorAtual={modalEdit.valor} onSalvar={salvarEdicao} />
    </>
  );
}

// ==================== ESTILOS GERAIS ====================
const styles = StyleSheet.create({
  containerAuth: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContentAuth: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  cardAuth: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 25, elevation: 5 },
  iconContainerAuth: { alignItems: 'center', marginBottom: 15 },
  iconCircleAuth: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  tituloAuth: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 5 },
  subtituloAuth: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 25 },
  inputGroupAuth: { marginBottom: 18 },
  labelAuth: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  inputContainerAuth: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 15, backgroundColor: '#F9FAFB' },
  inputIconAuth: { marginRight: 10 },
  inputAuth: { flex: 1, paddingVertical: 12, fontSize: 15 },
  eyeIconAuth: { padding: 5 },
  botaoEntrarAuth: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', elevation: 2 },
  botaoEntrarTextAuth: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  linkEsqueciTextAuth: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  cadastroContainerAuth: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  cadastroTextAuth: { color: '#6B7280' },
  cadastroLinkAuth: { fontWeight: 'bold' },

  containerHome: { flex: 1, backgroundColor: '#F8FAFC' },
  blueHeader: { backgroundColor: '#1E3A8A', paddingTop: Platform.OS === 'ios' ? 40 : 50, paddingBottom: 25, paddingHorizontal: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saudacaoHome: { color: '#BFDBFE', fontSize: 16 },
  nomeUsuarioHome: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  badgeTipo: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  
  contentScroll: { paddingHorizontal: 20 },
  secaoTitulo: { fontSize: 19, fontWeight: 'bold', color: '#1E293B', marginTop: 15, marginBottom: 15 },
  
  cardOracao: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1, borderRadius: 20, padding: 20, marginTop: 20, marginBottom: 10, elevation: 2 },
  linhaOracao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tituloOracao: { fontSize: 18, fontWeight: 'bold', color: '#92400E', marginLeft: 10 },
  textoOracao: { fontSize: 16, color: '#B45309', fontStyle: 'italic', lineHeight: 24 },

  cardNovo: { backgroundColor: '#FFF', flexDirection: 'row', padding: 18, borderRadius: 22, alignItems: 'center', marginBottom: 14, elevation: 3 },
  cardIconCircle: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardInfoContent: { flex: 1, marginLeft: 15 },
  cardTituloInterno: { fontSize: 16, fontWeight: 'bold', color: '#334155' },
  cardTextoInterno: { fontSize: 14, color: '#64748B', marginTop: 3, lineHeight: 20 },
  
  btnVerMais: { backgroundColor: '#DBEAFE', marginTop: 5, padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  btnVerMaisText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 14, marginRight: 5 },

  cardAlimentos: { backgroundColor: '#2563EB', borderRadius: 28, padding: 22, elevation: 6 },
  alimentosHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  alimentosTitulo: { color: '#FFF', fontSize: 19, fontWeight: 'bold', marginLeft: 10 },
  alimentosDesc: { color: '#DBEAFE', fontSize: 14, marginBottom: 18, lineHeight: 20 },
  btnDoarAgora: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16 },
  btnDoarText: { color: '#FFF', fontWeight: 'bold', fontSize: 15, marginRight: 10 },

  btnSairNovo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 35, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: '#FECACA' },
  btnSairText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 10 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  modalInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 15, fontSize: 16, color: '#334155', minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  modalBotoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  modalBtnCancelar: { paddingVertical: 10, paddingHorizontal: 15, marginRight: 10 },
  modalBtnTextCancelar: { color: '#64748B', fontWeight: 'bold', fontSize: 15 },
  modalBtnSalvar: { backgroundColor: '#1E40AF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  modalBtnTextSalvar: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  cardItemOrganizado: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 2 },
  btnAdicionarNovo: { backgroundColor: '#1E40AF', flexDirection: 'row', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  inputSimples: { backgroundColor: '#F1F5F9', borderRadius: 10, padding: 15, marginBottom: 10, fontSize: 15 },

  // ESTILOS DA NOTIFICAÇÃO NO TOPO
  notificacaoBox: { position: 'absolute', top: 0, left: 15, right: 15, zIndex: 9999, elevation: 15 },
  notificacaoContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#10B981', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  notificacaoIcon: { backgroundColor: '#10B981', width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  notificacaoTitulo: { fontWeight: 'bold', color: '#1E293B', fontSize: 14 },
  notificacaoTexto: { color: '#64748B', fontSize: 13, marginTop: 2 }
});