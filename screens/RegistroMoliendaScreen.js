import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Share, Vibration, Image} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Formik } from "formik";
import * as Yup from "yup";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const placas = ["GTG-7250", "GTJ-3251", "GTP-2673"];

const generarPrecintosPersonalizados = (prefijo, texto) => {
  if (!prefijo || !texto) return "";

  let resultado = [];
  const partes = texto.split(",");

  partes.forEach((parte) => {
    const valor = parte.trim();

    if (valor.includes("-")) {
      const [inicio, fin] = valor.split("-").map((n) => parseInt(n.trim()));

      if (!isNaN(inicio) && !isNaN(fin) && inicio <= fin) {
        for (let i = inicio; i <= fin; i++) {
          resultado.push(i);
        }
      }
    } else {
      const numero = parseInt(valor);

      if (!isNaN(numero)) {
        resultado.push(numero);
      }
    }
  });

  if (resultado.length === 0) return "";

  return `${prefijo} – ${resultado.join(" – ")}`;
};

const MoliendaSchema = Yup.object().shape({
  tipoMolino: Yup.string().required("El tipo de molino es obligatorio"),
  origen: Yup.string().required("El origen es obligatorio"),
  horaLlegada: Yup.string().required("La hora de llegada es obligatoria"),
  vehiculo: Yup.string().required("El vehículo es obligatorio"),
  placa: Yup.string().required("Seleccione la placa"),
  guia: Yup.string().required("La guía es obligatoria"),
  prefijo: Yup.string().required("El prefijo es obligatorio"),
  material1: Yup.string().required("Ingrese al menos un material"),
  cantidad1: Yup.string().required("Ingrese la cantidad"),
  precintos1: Yup.string().required("Ingrese los precintos"),
  novedad: Yup.string().required("La novedad es obligatoria"),
});

const RegistroMoliendaScreen = ({ navigation }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [fotoGuia, setFotoGuia] = useState(null);
  const [reporteGenerado, setReporteGenerado] = useState("");

  const inputStyle = (field) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debe permitir el uso de la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled) {
      setFotoGuia(result.assets[0].uri);
    }
  };

  const subirFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Debe permitir acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoGuia(result.assets[0].uri);
    }
  };

  const construirReporte = (values) => {
    const materiales = [
      {
        nombre: values.material1,
        cantidad: values.cantidad1,
        precintos: values.precintos1,
      },
      {
        nombre: values.material2,
        cantidad: values.cantidad2,
        precintos: values.precintos2,
      },
      {
        nombre: values.material3,
        cantidad: values.cantidad3,
        precintos: values.precintos3,
      },
    ].filter((item) => item.nombre && item.cantidad);

    const resumenMateriales = materiales
      .map((item) => `*${item.cantidad}* ${item.nombre}`)
      .join(" + ");

    const clasificados = materiales
      .map((item) => `- ${item.nombre} = *${item.cantidad}*`)
      .join("\n");

    const precintosClasificados = materiales
      .map((item) => {
        const secuencia = generarPrecintosPersonalizados(
          values.prefijo,
          item.precintos
        );

        return `*${item.nombre}: Cod.* ${secuencia}.`;
      })
      .join("\n\n");

    return `*---REPORTE DE MATERIAL RECIBIDO---*

*Informe Material Recibido:*

*${values.tipoMolino} finalización de molienda ${values.origen}*

*-* Hora de llegada. - *(${values.horaLlegada})* / Se confirma en verificación física el total. - ${resumenMateriales} / Cargado, traslada. – ${values.vehiculo} *(${values.placa})* Concuerda cantidad con guía emitida *(No. ${values.guia})*

Clasificados. -

${clasificados}

Precintos Códigos Clasificados:

${precintosClasificados}

*Novedad:* ${values.novedad}.`;
  };

  const compartirReporte = (values) => {
    const reporte = construirReporte(values);
    setReporteGenerado(reporte);

    Alert.alert(
      "Confirmar reporte",
      "Revise la vista previa antes de compartir. ¿Desea enviar este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Compartir",
          onPress: async () => {
            Vibration.vibrate(100);
            await Share.share({ message: reporte });
          },
        },
      ]
    );
  };

  const compartirGuia = async () => {
    if (!fotoGuia) {
      Alert.alert("Aviso", "Primero debe tomar o subir la foto de la guía");
      return;
    }

    const disponible = await Sharing.isAvailableAsync();

    if (!disponible) {
      Alert.alert("Error", "La opción de compartir no está disponible");
      return;
    }

    Vibration.vibrate(100);

    await Sharing.shareAsync(fotoGuia, {
      mimeType: "image/jpeg",
      dialogTitle: "Compartir foto de guía",
    });
  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Registro de Molienda</Text>
      <Text style={styles.subtitle}>Material Recibido</Text>

      <Formik
        initialValues={{
          tipoMolino: "",
          origen: "",
          horaLlegada: "",
          vehiculo: "",
          placa: "",
          guia: "",
          prefijo: "MPCR",

          material1: "",
          cantidad1: "",
          precintos1: "",

          material2: "",
          cantidad2: "",
          precintos2: "",

          material3: "",
          cantidad3: "",
          precintos3: "",

          novedad: "Sin novedad",
        }}
        validationSchema={MoliendaSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const reporte = construirReporte(values);

            await addDoc(collection(db, "materiales"), {
              ...values,
              tipoRegistro: "Material Recibido",
              categoria: "Molienda",
              reporte,
              fotoGuia,
              fechaRegistro: new Date().toLocaleDateString(),
              horaRegistro: new Date().toLocaleTimeString(),
              timestamp: Date.now(),
            });

            setReporteGenerado(reporte);

            Alert.alert("Registro exitoso", "El reporte fue guardado");
            resetForm();
            setFotoGuia(null);
          } catch (error) {
            Alert.alert("Error", "No se pudo guardar el reporte");
            console.log(error);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Datos generales</Text>

              <Text style={styles.label}>Tipo de molino</Text>
              <TextInput
                style={inputStyle("tipoMolino")}
                placeholder="Ej: Molinos Chilenos / Molino de Bola"
                value={values.tipoMolino}
                onChangeText={handleChange("tipoMolino")}
                onFocus={() => setFocusedField("tipoMolino")}
                onBlur={(e) => {
                  handleBlur("tipoMolino")(e);
                  setFocusedField(null);
                }}
              />
              {touched.tipoMolino && errors.tipoMolino && (
                <Text style={styles.error}>{errors.tipoMolino}</Text>
              )}

              <Text style={styles.label}>Origen</Text>
              <TextInput
                style={inputStyle("origen")}
                placeholder="Ej: Guanache - Mollopongo"
                value={values.origen}
                onChangeText={handleChange("origen")}
                onFocus={() => setFocusedField("origen")}
                onBlur={(e) => {
                  handleBlur("origen")(e);
                  setFocusedField(null);
                }}
              />
              {touched.origen && errors.origen && (
                <Text style={styles.error}>{errors.origen}</Text>
              )}

              <Text style={styles.label}>Hora de llegada</Text>
              <TextInput
                style={inputStyle("horaLlegada")}
                placeholder="Ej: 09h00"
                value={values.horaLlegada}
                onChangeText={handleChange("horaLlegada")}
                onFocus={() => setFocusedField("horaLlegada")}
                onBlur={(e) => {
                  handleBlur("horaLlegada")(e);
                  setFocusedField(null);
                }}
              />
              {touched.horaLlegada && errors.horaLlegada && (
                <Text style={styles.error}>{errors.horaLlegada}</Text>
              )}

              <Text style={styles.label}>Vehículo</Text>
              <TextInput
                style={inputStyle("vehiculo")}
                placeholder="Ej: Camioneta / Camión"
                value={values.vehiculo}
                onChangeText={handleChange("vehiculo")}
                onFocus={() => setFocusedField("vehiculo")}
                onBlur={(e) => {
                  handleBlur("vehiculo")(e);
                  setFocusedField(null);
                }}
              />
              {touched.vehiculo && errors.vehiculo && (
                <Text style={styles.error}>{errors.vehiculo}</Text>
              )}

              <Text style={styles.label}>Seleccione la placa</Text>
              <View style={styles.plateGroup}>
                {placas.map((placa) => (
                  <TouchableOpacity
                    key={placa}
                    style={[
                      styles.plateButton,
                      values.placa === placa && styles.plateButtonActive,
                    ]}
                    onPress={() => setFieldValue("placa", placa)}
                  >
                    <Text
                      style={[
                        styles.plateText,
                        values.placa === placa && styles.plateTextActive,
                      ]}
                    >
                      {placa}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.placa && errors.placa && (
                <Text style={styles.error}>{errors.placa}</Text>
              )}

              <Text style={styles.label}>Número de guía</Text>
              <TextInput
                style={inputStyle("guia")}
                placeholder="Ej: 003-002-000000226"
                value={values.guia}
                onChangeText={handleChange("guia")}
                onFocus={() => setFocusedField("guia")}
                onBlur={(e) => {
                  handleBlur("guia")(e);
                  setFocusedField(null);
                }}
              />
              {touched.guia && errors.guia && (
                <Text style={styles.error}>{errors.guia}</Text>
              )}

              <Text style={styles.label}>Prefijo de precinto</Text>
              <TextInput
                style={inputStyle("prefijo")}
                placeholder="Ej: MPCR"
                value={values.prefijo}
                onChangeText={handleChange("prefijo")}
                onFocus={() => setFocusedField("prefijo")}
                onBlur={(e) => {
                  handleBlur("prefijo")(e);
                  setFocusedField(null);
                }}
                autoCapitalize="characters"
              />
              {touched.prefijo && errors.prefijo && (
                <Text style={styles.error}>{errors.prefijo}</Text>
              )}
            </View>

            {[1, 2, 3].map((num) => (
              <View style={styles.section} key={num}>
                <Text style={styles.sectionTitle}>
                  Material clasificado {num}
                </Text>

                <Text style={styles.label}>Material</Text>
                <TextInput
                  style={inputStyle(`material${num}`)}
                  placeholder={
                    num === 1
                      ? "Ej: Conc. Olla"
                      : num === 2
                      ? "Ej: Conc. Gold-Kacha BYT"
                      : "Ej: Conc. K-N"
                  }
                  value={values[`material${num}`]}
                  onChangeText={handleChange(`material${num}`)}
                />
                {num === 1 && touched.material1 && errors.material1 && (
                  <Text style={styles.error}>{errors.material1}</Text>
                )}

                <Text style={styles.label}>Cantidad</Text>
                <TextInput
                  style={inputStyle(`cantidad${num}`)}
                  placeholder="Ej: 05"
                  value={values[`cantidad${num}`]}
                  onChangeText={handleChange(`cantidad${num}`)}
                  keyboardType="numeric"
                />
                {num === 1 && touched.cantidad1 && errors.cantidad1 && (
                  <Text style={styles.error}>{errors.cantidad1}</Text>
                )}

                <Text style={styles.label}>Precintos</Text>
                <TextInput
                  style={inputStyle(`precintos${num}`)}
                  placeholder="Ej: 14773-14788 o 14773,14775-14780"
                  value={values[`precintos${num}`]}
                  onChangeText={handleChange(`precintos${num}`)}
                />
                {num === 1 && touched.precintos1 && errors.precintos1 && (
                  <Text style={styles.error}>{errors.precintos1}</Text>
                )}
              </View>
            ))}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Novedad y evidencia</Text>

              <Text style={styles.label}>Novedad</Text>
              <TextInput
                style={inputStyle("novedad")}
                placeholder="Ej: Sin novedad"
                value={values.novedad}
                onChangeText={handleChange("novedad")}
              />
              {touched.novedad && errors.novedad && (
                <Text style={styles.error}>{errors.novedad}</Text>
              )}

              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.darkAction} onPress={tomarFoto}>
                  <Text style={styles.actionText}>Tomar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.darkAction} onPress={subirFoto}>
                  <Text style={styles.actionText}>Subir Guía</Text>
                </TouchableOpacity>
              </View>

              {fotoGuia && (
                <Image source={{ uri: fotoGuia }} style={styles.preview} />
              )}
            </View>

            <View style={styles.actionPanel}>
              <TouchableOpacity style={styles.shareButton} onPress={() => compartirReporte(values)} >
                <Text style={styles.buttonText}>Compartir Reporte</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.darkButton} onPress={compartirGuia}>
                <Text style={styles.buttonText}>Compartir Guía</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar Reporte</Text>
              </TouchableOpacity>
            </View>

            {reporteGenerado !== "" && (
              <View style={styles.reportBox}>
                <Text style={styles.reportTitle}>Vista previa del reporte</Text>
                <Text style={styles.reportText}>{reporteGenerado}</Text>
              </View>
            )}
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default RegistroMoliendaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },

  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
  },

  plateGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },

  plateButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 12,
    marginBottom: 8,
  },

  plateButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  plateText: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 14,
  },

  plateTextActive: {
    color: "#ffffff",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },

  actionGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },

  darkAction: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },

  actionText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },

  preview: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginTop: 15,
  },

  actionPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    elevation: 5,
    marginBottom: 18,
  },

  shareButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  darkButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  reportBox: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 40,
  },

  reportTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
  },

  reportText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
});