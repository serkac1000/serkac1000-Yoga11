
plugins {
    id("com.android.application") version "8.2.0"
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
