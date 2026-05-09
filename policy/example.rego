package main

deny[msg] {

  input.kind == "Deployment"

  not input.spec.template.spec.securityContext.runAsNonRoot

  msg := "Containers must run as non-root"
}
